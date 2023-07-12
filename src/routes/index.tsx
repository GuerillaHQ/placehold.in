import { component$ } from "@builder.io/qwik"
import { useLocation } from "@builder.io/qwik-city"
import { ENV, SUPPORTED_FORMATS } from "~/env"

export default component$(() => {
	const {
		url: { origin },
	} = useLocation()

	return (
		<>
			<p class="lead">
				A quick way to display placeholder images during mockups and
				development using a simple and comprehensive syntax.
			</p>

			<div class="border-2 border-gray-200 bg-gray-100 p-2">
				<span>{origin}/</span>
				<span class="bg-blue-100">300x200</span>
				<span class="bg-yellow-100">@2x</span>
				<span class="bg-green-100">.png</span>
				<span class="bg-red-100">?dark</span>
			</div>

			<menu>
				<ul>
					<li>
						<a href="#dimensions" class="bg-blue-100">
							Dimensions
						</a>
					</li>
					<li>
						<a href="#dpr" class="bg-yellow-100">
							Device pixel ratio
						</a>
					</li>
					<li>
						<a href="#format" class="bg-green-100">
							Format
						</a>
					</li>
					<li>
						<a href="#theme" class="bg-red-100">
							Theme
						</a>
					</li>
				</ul>
			</menu>

			<ExampleImage parameters="300x200@2x.png?dark" />

			<section id="dimensions">
				<h2>
					<span class="bg-blue-100">Dimensions</span>
				</h2>

				<p>
					Required. Allowed value for both width and height is a
					positive integer between <code>1</code> and{" "}
					<code>{ENV.DIMENSION_MAX}</code>.
				</p>

				<div class="flex justify-between">
					<ExampleImage parameters="200" />
					<ExampleImage parameters="300x200" />
				</div>
			</section>

			<section id="dpr">
				<h2>
					<span class="bg-yellow-100">Device pixel ratio</span>
				</h2>

				<p>
					Optional with <code>1</code> as default. Allowed value is a
					positive integer between <code>1</code> and{" "}
					<code>{ENV.DPR_MAX}</code>.
				</p>

				<div class="flex justify-between">
					<ExampleImage parameters="100@2x" />
					<ExampleImage parameters="50@4x" />
				</div>
			</section>

			<section id="format">
				<h2>
					<span class="bg-green-100">Format</span>
				</h2>

				<p>
					Optional with <code>{ENV.FORMAT_DEFAULT}</code> as default. Allowed values
					are {SUPPORTED_FORMATS.map((format, index) => (
						<>
							{index > 0 && index !== SUPPORTED_FORMATS.length - 1 ? ", " : " and "}
							<code>{format}</code>
						</>
					))}.
				</p>

				<div class="flex justify-between">
					<ExampleImage parameters="200.png" />
					<ExampleImage parameters="200.webp" />
				</div>
			</section>

			<section id="theme">
				<h2>
					<span class="bg-red-100">Theme</span>
				</h2>

				<p>
					Optional using the light theme as default. When specified
					the dark theme is used instead.
				</p>

				<div class="flex justify-between">
					<ExampleImage parameters="200" />
					<ExampleImage parameters="200?dark" />
				</div>
			</section>
            <section>
					<ExampleImage parameters="25" />
					<ExampleImage parameters="35" />
					<ExampleImage parameters="300" />

            </section>
		</>
	)
})

const ExampleImage = component$(({ parameters }: { parameters: string }) => {
	const {
		url: { origin },
	} = useLocation()

	const path = `${origin}/${parameters}`

	return (
		<figure>
			<img src={path} alt={`Placeholder image using ${parameters}`} />
			<figcaption>{path}</figcaption>
		</figure>
	)
})
