/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
            colors: {
                primary: '#8f358d'
            }
        },

	},
	plugins: [require("@tailwindcss/typography")],
}
