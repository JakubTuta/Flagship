interface PageHeadOptions {
  htmlAttrs?: Record<string, string>
  bodyAttrs?: Record<string, string>

  scripts?: Array<{
    src?: string
    content?: string
    async?: boolean
    defer?: boolean
    type?: string
    crossorigin?: 'anonymous' | 'use-credentials'
    integrity?: string
    nomodule?: boolean
    [key: string]: any
  }>

  links?: Array<{
    rel: string
    href?: string
    type?: string
    media?: string
    crossorigin?: 'anonymous' | 'use-credentials'
    integrity?: string
    [key: string]: any
  }>

  styles?: Array<{
    content: string
    media?: string
    [key: string]: any
  }>

  meta?: Array<{
    name?: string
    property?: string
    content: string
    [key: string]: any
  }>

  title?: string

  presets?: {
    analytics?: 'google' | 'gtm' | 'custom'
    analyticsId?: string
    fonts?: 'google' | 'custom'
    fontUrls?: string[]
    theme?: 'dark' | 'light' | 'auto'
    pwa?: boolean
    canonical?: boolean | string
  }

  useTranslation?: boolean
  translationKey?: string
}

export function usePageHead(options: PageHeadOptions = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()

  let t: any, locale: any
  try {
    const i18n = useI18n()
    t = i18n.t
    locale = i18n.locale
  }
  catch {
    t = (key: string) => key
    locale = { value: 'en' }
  }

  const {
    htmlAttrs = {},
    bodyAttrs = {},
    scripts = [],
    links = [],
    styles = [],
    meta = [],
    title,
    presets = {},
    useTranslation = false,
    translationKey = '',
  } = options

  const headConfig: any = {}

  if (Object.keys(htmlAttrs).length || locale) {
    headConfig.htmlAttrs = {
      lang: locale.value,
      ...htmlAttrs,
    }
  }

  if (Object.keys(bodyAttrs).length) {
    headConfig.bodyAttrs = bodyAttrs
  }

  if (title) {
    headConfig.title = useTranslation && translationKey
      ? t(`${translationKey}.title`)
      : title
  }

  if (presets.analytics) {
    scripts.push(...getAnalyticsScripts(presets.analytics, presets.analyticsId))
  }

  if (presets.fonts === 'google' && presets.fontUrls) {
    links.push(...getGoogleFontsLinks(presets.fontUrls))
  }

  if (presets.theme) {
    meta.push(...getThemeMetaTags(presets.theme))
  }

  if (presets.pwa) {
    links.push(...getPWALinks())
    meta.push(...getPWAMetaTags())
  }

  if (presets.canonical !== false) {
    const canonicalUrl = typeof presets.canonical === 'string'
      ? presets.canonical
      : `${config.public.siteUrl || ''}${route.path}`

    if (canonicalUrl) {
      links.push({ rel: 'canonical', href: canonicalUrl })
    }
  }

  if (scripts.length)
    headConfig.script = scripts
  if (links.length)
    headConfig.link = links
  if (styles.length)
    headConfig.style = styles
  if (meta.length)
    headConfig.meta = meta

  useHead(headConfig)
}

function getAnalyticsScripts(type: string, id?: string) {
  const scripts = []

  switch (type) {
    case 'google':
      if (id) {
        scripts.push(
          {
            src: `https://www.googletagmanager.com/gtag/js?id=${id}`,
            async: true,
          },
          {
            content: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${id}');
              `,
            type: 'text/javascript',
          },
        )
      }
      break

    case 'gtm':
      if (id) {
        scripts.push({
          content: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${id}');
            `,
          type: 'text/javascript',
        })
      }
      break
  }

  return scripts
}

function getGoogleFontsLinks(fontUrls: string[]) {
  const links = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' as const },
  ]

  fontUrls.forEach((url) => {
    links.push({ rel: 'stylesheet', href: url })
  })

  return links
}

function getThemeMetaTags(theme: string) {
  const meta = []

  switch (theme) {
    case 'dark':
      meta.push(
        { name: 'theme-color', content: '#000000' },
        { name: 'color-scheme', content: 'dark' },
      )
      break
    case 'light':
      meta.push(
        { name: 'theme-color', content: '#ffffff' },
        { name: 'color-scheme', content: 'light' },
      )
      break
    case 'auto':
      meta.push(
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#000000', media: '(prefers-color-scheme: dark)' },
        { name: 'color-scheme', content: 'light dark' },
      )
      break
  }

  return meta
}

function getPWALinks() {
  return [
    { rel: 'manifest', href: '/manifest.json' },
    { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
  ]
}

function getPWAMetaTags() {
  return [
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
  ]
}
