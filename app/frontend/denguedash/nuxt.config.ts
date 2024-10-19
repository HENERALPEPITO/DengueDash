// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
  },
  devtools: {
    enabled: true,
  },
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/leaflet",
    "@nuxt/ui",
    "@nuxt/icon",
    "@nuxt/fonts",
  ],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});