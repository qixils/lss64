// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
	devtools: { enabled: false },
	ssr: true,
	nitro: {
		prerender: {
			autoSubfolderIndex: false
		},
		output: {
			publicDir: "../../graphics"
		}
	},
	app: {
		baseURL: '/bundles/lss64/graphics/',
		head: {
			link: [
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
				{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Ubuntu+Mono&display=swap" }
			]
		}
	}
})
