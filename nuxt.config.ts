// primary-[50-950] => Primary color palette.
// surface-[0-950] => Surface color palette.
// primary => Default primary color.
// primary-contrast => Default primary contrast color.
// primary-emphasis => Default primary emphasis color.
// border-surface => Content border color.
// bg-emphasis => Emphasis background e.g. hovered element.
// bg-highlight => Highlight background.
// bg-highlight-emphasis => Highlight background with emphasis.
// rounded-border => Border radius.
// text-color => Text color with emphasis.
// text-color-emphasis => Default primary emphasis color.
// text-muted-color => Secondary text color.
// text-muted-color-emphasis => Secondary text color with emphasis.

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css',
    'primeicons/primeicons.css',
  ],

  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/test-utils/module',
    '@nuxt/fonts',
  ],

  primevue: {
    importTheme: {
      from: '~/core/config/primevue.config.ts',
    },
  },
})
