import { component$, Slot } from "@builder.io/qwik"
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city"

export const head: DocumentHead = {
	title: "Placehold.in - A Simple Image Placeholder",
	meta: [
		{
			name: "description",
			content: "A quick way to display placeholder images during mockups",
		},
	],
}

export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({
		public: true,
		maxAge: 5,
		staleWhileRevalidate: 60 * 60 * 24 * 365,
	})
}

export default component$(() => {
	return (
		<>
			<div class="max-w-xl mx-auto prose md:prose-xl px-4 py-8 prose-h1:mb-8">
				<header class="pt-8">
					<div class="flex items-baseline gap-x-2 md:gap-x-5">
					<img class="m-0 md:m-0 h-6 w-6 md:h-11 md:w-11" src="picto.svg" alt="" aria-hidden="true" width="42" height="42"/>
					<a href="/" class="no-underline">
                        <h1>Placehold.in</h1>
                    </a>
					</div>
				</header>
				<main>
					<Slot />
				</main>
				<footer class="pt-8 pb-6 md:py-16 text-slate-500 text-base text-center">
					<div class="not-prose text-3xl text-center text-slate-200 mb-4 md:mb-8" aria-hidden="true">∴</div>
					Made by <a href="https://guerilla.studio">Guérilla.Studio</a> • Hosted on Netlify
				</footer>
			</div>
		</>
	)
})
