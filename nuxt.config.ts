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
      githubToken: process.env.TOKEN_GITHUB,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
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
    },
  },

  routeRules: {
    // Static pages - prerendered at build time
    '/': { prerender: true },

    // Auth
    '/auth/login': { prerender: true },
    '/auth/register': { prerender: true },
    '/auth/logout': { prerender: true },

    '/resume': { prerender: true },
    '/projects': { prerender: true },
    '/blogs': { prerender: true },

    // Blog listing page - prerendered
    '/blog': { prerender: true },

    // Individual blog posts - use ISR for better performance
    // This will generate pages on first visit and cache them
    '/blog/**': {
      isr: 3600, // Cache for 1 hour
      headers: {
        'X-Custom-Header': 'Blog Post',
      },
    },

    // Admin routes - always server-rendered for security
    '/admin/**': { ssr: true },
  },

  experimental: {
    payloadExtraction: false,
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
      useCookie: true,
      cookieKey: 'tuta-lang',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
    // @ts-expect-error @nuxtjs/seo
    seo: true,
    baseUrl,
  },

  compatibilityDate: '2024-07-18',
})
