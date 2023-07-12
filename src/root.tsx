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
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#8f358d"/>
				<RouterHead />
				<ServiceWorkerRegister />
			</head>
			<body lang="en" class="border-t-8 border-primary">
				<RouterOutlet />
			</body>
		</QwikCityProvider>
	)
})
