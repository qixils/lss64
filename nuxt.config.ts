// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	ssr: true,
	nitro: {
		prerender: {
			autoSubfolderIndex: false
		},
		output: {
			publicDir: "graphics"
		}
	},
	app: {
		baseURL: '/bundles/lss64/graphics/'
	}
})
