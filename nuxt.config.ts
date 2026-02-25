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
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'keywords', content: 'developer, portfolio, projects, blog, resume, CV, contact, Jakub Tutka, full-stack developer, Python, Vue.js, Nuxt.js' },
        { name: 'author', content: 'Jakub Tutka' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#202428', media: '(prefers-color-scheme: dark)' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Jakub Tutka' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/images/profile.jpg' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'dns-prefetch', href: 'https://firestore.googleapis.com' },
        { rel: 'preconnect', href: 'https://firestore.googleapis.com', crossorigin: 'anonymous' },
      ],
    },
  },

  runtimeConfig: {
    // Private keys (only available on the server-side)
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
    public: {
      // Firebase configuration (available on both server and client)
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
      siteUrl: baseUrl,
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@unocss/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({ autoImport: true }))
      })
    },
  ],

  css: [
    '@unocss/reset/tailwind.css',
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
    prerender: {
      // Enable crawling for blog pages
      crawlLinks: true,
      routes: [
        '/blogs', // Blog listing page - contains links to individual blogs
        // Individual blog routes (/blog/[id]) will be discovered through crawling
        // from the links on the /blogs page
      ],
      ignore: [
        // Exclude admin routes from prerendering (require authentication)
        '/admin/**',
        '/admin',
        '/admin/files',
        '/admin/blog/panel',
        '/admin/blog/write',
        // Exclude auth routes from prerendering
        '/auth/**',
      ],
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

  // Sitemap configuration for SEO
  sitemap: {
    hostname: baseUrl,
    gzip: true,
    exclude: [
      '/admin/**',
      '/auth/**',
    ],
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
    },
    urls: [
      {
        url: '/',
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        url: '/blogs',
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        url: '/projects',
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        url: '/resume',
        changefreq: 'monthly',
        priority: 0.8,
      },
    ],
    sources: [
      '/api/blogs/sitemap',
    ],
  },

  // Robots.txt configuration
  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/admin', '/auth'],
    Sitemap: `${baseUrl}/sitemap.xml`,
  },

  compatibilityDate: '2024-07-18',
})
