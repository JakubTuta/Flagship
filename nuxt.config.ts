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
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#202428', media: '(prefers-color-scheme: dark)' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // Firebase configuration
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      // Other public configuration
      githubToken: process.env.TOKEN_GITHUB,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({ autoImport: true }))
      })
    },
  ],

  css: [
    '@/assets/css/utilities.css',
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

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

  ssr: true,

  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2,
      nodeVersion: '20',
    },
    storage: {
      memory: {
        driver: 'memory',
      },
    },
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
  },

  typescript: {
    strict: true,
  },

  vue: {
    propsDestructure: true,
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
      useCookie: false,
      alwaysRedirect: false,
      fallbackLocale: 'en',
      redirectOn: 'root',
    },
    baseUrl,
  },

  compatibilityDate: '2024-07-18',
})
