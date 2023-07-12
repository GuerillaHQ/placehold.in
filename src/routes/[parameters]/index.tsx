/** @jsxImportSource react */
import { type RequestHandler } from "@builder.io/qwik-city"
import fs from "node:fs/promises"
import { match } from "ts-pattern"
import satori from "satori"
import sharp from "sharp"
import { z } from "zod"
import { ENV, SUPPORTED_FORMATS } from "~/env"


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
						.with("avif", () => "image/avif")
						.with("heif", () => "image/heif")
						.with("jpeg", () => "image/jpeg")
						.with("jxl", () => "image/jxl")
						.with("png", () => "image/png")
						.with("svg", () => "image/svg+xml")
						.with("webp", () => "image/jpeg")
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
	const fontSizeMax = 45
	const fontSizeRatio = .17
	const fontSizeComputed = Math.min(Math.min(props.width, props.height) * props.dpr * fontSizeRatio, fontSizeMax)

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
				fontSize: fontSizeComputed,
				fontWeight: 600,
			}}
		>
			<div>{`${props.width}x${props.height}`}</div>
			<div>{`@${props.dpr}x .${props.format}`}</div>
		</div>
	)
}

const positiveInt = z.coerce.number().int().positive()

export const parametersSchema = z.object({
	width: positiveInt.max(ENV.DIMENSION_MAX),
	height: positiveInt.max(ENV.DIMENSION_MAX),
	dpr: positiveInt.max(ENV.DPR_MAX).default(1),
	format: z.enum(SUPPORTED_FORMATS).default(ENV.FORMAT_DEFAULT),
})

export type Parameters = z.infer<typeof parametersSchema>

const literalParametersRegex =
	/^(?<width>\d+)(?:x?(?<height>\d+))?(?:@(?<dpr>\d+)x)?(?:\.(?<format>\w+))?$/

export const literalParametersSchema = z
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
