/* eslint-disable node/prefer-global/process */
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const appName = 'Jakub Tutka | Developer Portfolio'
const baseUrl = 'https://jakubtutka.com'

export default defineNuxtConfig({
  app: {
    baseURL: '/',
    head: {
      title: appName,
      titleTemplate: '%s | Jakub Tutka Portfolio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { name: 'keywords', content: 'developer, portfolio, projects, blog, resume, CV, contact, Jakub Tutka' },
        { name: 'author', content: 'Jakub Tutka' },
      ],
    },
  },

  site: {
    url: baseUrl,
    name: appName,
  },

  runtimeConfig: {
    public: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({ autoImport: true }))
      })
    },
  ],

  imports: {
    autoImport: true,
    dirs: [
      'stores/**',
      'constants/**',
      'components/**',
      'composables/**',
      'helpers/**',
      'utils/**',
    ],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  ssr: true,

  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2,
      nodeVersion: '20',
      // @ts-expect-error nitro preset options
      region: 'europe-central2',
    },
  },

  experimental: {
    payloadExtraction: false,
  },

  typescript: {
    strict: true,
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    vueI18n: './i18n.config.ts',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
      },
      {
        code: 'pl',
        iso: 'pl-PL',
        name: 'Polski',
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    // @ts-expect-error @nuxtjs/seo
    seo: true,
    baseUrl,
  },

  compatibilityDate: '2024-07-18',
})
