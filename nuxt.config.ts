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
        { name: 'color-scheme', content: 'dark light' },
        { name: 'theme-color', content: '#f3f1f8', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#26233a', media: '(prefers-color-scheme: dark)' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Jakub Tutka' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/images/profile.jpg' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'preconnect', href: 'https://files.jtuta.cloud', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    fileStorage: {
      username: process.env.FILE_STORAGE_USERNAME,
      password: process.env.FILE_STORAGE_PASSWORD,
    },
    public: {
      siteUrl: baseUrl,
      fileStorageBaseUrl: 'https://files.jtuta.cloud',
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
    'assets/css/design-system.css',
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
    preset: 'node-server',
    serverAssets: [
      {
        baseName: 'content',
        dir: 'server/content',
      },
    ],
    storage: {
      views: {
        driver: 'fs',
        base: './.data/views',
      },
    },
    devStorage: {
      'assets:content': {
        driver: 'fs',
        base: './server/content',
      },
    },
    prerender: {
      crawlLinks: true,
      routes: ['/blogs'],
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

  // Sitemap configuration for SEO (cast to any — v7 types differ from installed config format)
  sitemap: {
    gzip: true,
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
    },
    urls: [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        loc: '/blogs',
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: '/projects',
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        loc: '/resume',
        changefreq: 'monthly',
        priority: 0.8,
      },
    ],
    sources: [
      '/api/blogs/sitemap',
    ],
  } as any,

  // Robots.txt configuration (v4 format kept; cast to bypass v5 type mismatch)
  robots: {
    UserAgent: '*',
    Allow: '/',
    Sitemap: `${baseUrl}/sitemap.xml`,
  } as any,

  compatibilityDate: '2024-07-18',
})
