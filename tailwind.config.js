/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				primary: '#8f358d'
			},
			screens: {
				'xs': '400px'
			}
		},

	},
	plugins: [require("@tailwindcss/typography")],
}
