import { component$ } from "@builder.io/qwik"
import {
	QwikCityProvider,
	RouterOutlet,
	ServiceWorkerRegister,
} from "@builder.io/qwik-city"

import "./global.css"
import { RouterHead } from "./components/router-head"

export default component$(() => {
	/**
	 * The root of a QwikCity site always start with the <QwikCityProvider> component,
	 * immediately followed by the document's <head> and <body>.
	 *
	 * Don't remove the `<head>` and `<body>` elements.
	 */

	return (
		<QwikCityProvider>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#8f358d" />

				<meta
					property="og:title"
					content="Placehold.in ∴ A Simple Image Placeholder"
				/>
				<meta
					property="og:description"
					content="A quick way to display placeholder images during mockups"
				/>
				<meta property="og:url" content="https://placehold.in" />
				<meta
					property="og:image"
					content="https://placehold.in/favicon-big.png"
				/>
				<meta property="og:image:width" content="512" />
				<meta property="og:image:height" content="512" />

				<link
					rel="preload"
					href="/picto.svg"
					as="image"
					type="image/svg+xml"
				/>

				<RouterHead />
				<ServiceWorkerRegister />
			</head>
			<body lang="en" class="border-t-8 border-primary scroll-smooth">
				<RouterOutlet />
			</body>
		</QwikCityProvider>
	)
})
