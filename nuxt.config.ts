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

import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: false },

  runtimeConfig: {
    spotifyClientId: process.env.NUXT_SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID || process.env.CLIENT_ID || '',
    spotifyClientSecret: process.env.NUXT_SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET || process.env.CLIENT_SECRET || process.env.CLIENT_SECRETS || '',
    spotifyRefreshToken: process.env.NUXT_SPOTIFY_REFRESH_TOKEN || process.env.SPOTIFY_REFRESH_TOKEN || process.env.SPOTIFY_REFRESH || '',
    apiSecret: process.env.NUXT_API_SECRET || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      appEnv: process.env.NUXT_PUBLIC_APP_ENV || 'production',
    },
  },

  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-free/css/all.min.css',
    'primeicons/primeicons.css',
  ],

  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/fonts',
  ],

  primevue: {
    importTheme: {
      from: '~/core/config/primevue.config.ts',
    },
  },
})

