import { component$, Slot } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"

export const head: DocumentHead = {
	title: "Welcome to Qwik",
	meta: [
		{
			name: "description",
			content: "Qwik site description",
		},
	],
}

export default component$(() => {
	return (
		<>
			<main class="max-w-xl mx-auto px-4 py-8 prose lg:prose-xl">
				<Slot />
			</main>
		</>
	)
})
