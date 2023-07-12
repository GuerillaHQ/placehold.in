/** @jsxImportSource react */
import { type RequestHandler } from "@builder.io/qwik-city"
import fs from "node:fs/promises"
import { match } from "ts-pattern"
import satori from "satori"
import sharp from "sharp"
import { z } from "zod"

export const onGet: RequestHandler = async ({ params, query, json, send }) => {
	const literalResult = literalParametersSchema.safeParse(params.parameters)

	if (!literalResult.success) {
		json(200, {
			description: "Invalid parameters",
			issues: literalResult.error.issues,
		})
	} else {
		const parameters = literalResult.data
		const dark = query.has("dark")

		send(
			new Response(await generateImage(parameters, dark), {
				status: 200,
				headers: {
					"Content-Type": match(parameters.format)
						.with("svg", () => "image/svg+xml")
						.with("png", () => "image/png")
						.with("webp", () => "image/jpeg")
						.with("jpeg", () => "image/jpeg")
						.exhaustive(),
				},
			})
		)
	}
}

async function generateImage(parameters: Parameters, dark: boolean) {
	const svg = await satori(<Placeholder {...parameters} dark={dark} />, {
		width: parameters.width * parameters.dpr,
		height: parameters.height * parameters.dpr,
		fonts: [
			{
				name: "Inter",
				data: await fs.readFile(
					"./public/fonts/Inter/static/Inter-Regular.ttf"
				),
			},
		],
	})

	if (parameters.format === "svg") {
		return svg
	} else {
		return sharp(Buffer.from(svg)).toFormat(parameters.format).toBuffer()
	}
}

function Placeholder(props: Parameters & { dark: boolean }) {
	const darkColor = "#1a1110"
	const lightColor = "#f7f7f7"

	return (
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: props.dark ? darkColor : lightColor,
				color: props.dark ? lightColor : darkColor,
				fontSize: 32,
				fontWeight: 600,
			}}
		>
			<div>{`${props.width}x${props.height}`}</div>
			<div>{`@${props.dpr}x .${props.format}`}</div>
		</div>
	)
}

const SUPPORTED_FORMATS = ["svg", "png", "jpeg", "webp"] as const

const positiveInt = z.coerce.number().int().positive()

const envSchema = z.object({
	WIDTH_MAX: positiveInt,
	HEIGHT_MAX: positiveInt,
	DPR_MAX: positiveInt,
	FORMAT_DEFAULT: z.enum(SUPPORTED_FORMATS),
	FORMAT_LIST: z
		.string()
		.transform((value) => value.split(","))
		.pipe(z.array(z.enum(SUPPORTED_FORMATS)).nonempty()),
})

type Env = z.infer<typeof envSchema>

const env: Env = {
	WIDTH_MAX: 1600,
	HEIGHT_MAX: 1600,
	DPR_MAX: 5,
	FORMAT_DEFAULT: "svg",
	FORMAT_LIST: ["svg", "png", "jpeg", "webp"],
}

const parametersSchema = z.object({
	width: positiveInt.max(env.WIDTH_MAX),
	height: positiveInt.max(env.HEIGHT_MAX),
	dpr: positiveInt.max(env.DPR_MAX).default(1),
	format: z.enum(SUPPORTED_FORMATS).default(env.FORMAT_DEFAULT),
})

type Parameters = z.infer<typeof parametersSchema>

const literalParametersRegex =
	/^(?<width>\d+)(?:x?(?<height>\d+))?(?:@(?<dpr>\d+)x)?(?:\.(?<format>\w+))?$/

const literalParametersSchema = z
	.string()
	.regex(literalParametersRegex)
	.transform((value) => {
		const matches = value.match(literalParametersRegex)

		if (!matches || !matches.groups) {
			return {}
		}

		const { width, height, dpr, format } = matches.groups
		return { width, height: height ?? width, dpr, format }
	})
	.pipe(parametersSchema)
