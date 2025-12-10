/**
 * Enhanced SEO composable following 2025 best practices
 * Handles meta tags, Open Graph, Twitter Cards, and hreflang for bilingual content
 */

interface SeoOptions {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  url?: string
  type?: 'website' | 'article' | 'book' | 'profile' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  useTranslation?: boolean
  translationKey?: string
  siteName?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  noIndex?: boolean
  noFollow?: boolean
  canonical?: string
}

export function useSeo(options: SeoOptions = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const { t, locale } = useI18n()

  const {
    title,
    description,
    image = `${config.public.siteUrl}/images/profile.jpg`,
    imageAlt,
    imageWidth = 1200,
    imageHeight = 630,
    url = `${config.public.siteUrl}${route.path}`,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    tags = [],
    useTranslation = false,
    translationKey = '',
    siteName = 'Jakub Tutka | Developer Portfolio',
    twitterCard = 'summary_large_image',
    noIndex = false,
    noFollow = false,
    canonical,
  } = options

  // Get translated content if needed
  const finalTitle = useTranslation && translationKey
    ? t(`${translationKey}.title`)
    : title || t('seo.site.title')

  const finalDescription = useTranslation && translationKey
    ? t(`${translationKey}.description`)
    : description || t('seo.site.description')

  const finalTags = useTranslation && translationKey
    ? t(`${translationKey}.tags`).split(',').map(tag => tag.trim())
    : tags

  // Ensure image is absolute URL
  const absoluteImage = image.startsWith('http')
    ? image
    : `${config.public.siteUrl}${image}`

  // Ensure URL is absolute
  const absoluteUrl = url.startsWith('http')
    ? url
    : `${config.public.siteUrl}${url}`

  // Build robots directive
  const robotsDirectives = []
  if (noIndex)
    robotsDirectives.push('noindex')
  else
    robotsDirectives.push('index')

  if (noFollow)
    robotsDirectives.push('nofollow')
  else
    robotsDirectives.push('follow')

  robotsDirectives.push('max-image-preview:large')
  robotsDirectives.push('max-snippet:-1')
  robotsDirectives.push('max-video-preview:-1')

  const robotsContent = robotsDirectives.join(', ')

  // Set comprehensive SEO meta tags
  useSeoMeta({
    // Basic meta tags
    title: finalTitle,
    description: finalDescription,
    robots: robotsContent,
    googlebot: robotsContent,

    // Open Graph tags
    ogTitle: `${finalTitle} | ${siteName}`,
    ogDescription: finalDescription,
    ogImage: absoluteImage,
    ogImageAlt: imageAlt || finalTitle,
    ogImageWidth: String(imageWidth),
    ogImageHeight: String(imageHeight),
    ogUrl: absoluteUrl,
    ogType: type,
    ogSiteName: siteName,
    ogLocale: locale.value === 'en'
      ? 'en_US'
      : 'pl_PL',
    ogLocaleAlternate: locale.value === 'en'
      ? 'pl_PL'
      : 'en_US',

    // Article-specific tags
    ...(type === 'article' && {
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime || publishedTime,
      'article:author': author,
      'article:tag': finalTags.length > 0
        ? finalTags
        : undefined,
    }),

    // Twitter Card tags
    twitterCard,
    twitterTitle: finalTitle,
    twitterDescription: finalDescription,
    twitterImage: absoluteImage,
    twitterImageAlt: imageAlt || finalTitle,
    twitterSite: '@JakubTutka',
    twitterCreator: '@JakubTutka',

    // Additional meta tags
    ...(author && { author }),
    ...(finalTags.length > 0 && { keywords: finalTags.join(', ') }),
  })

  // Get alternate locale path
  const localePath = useLocalePath()
  const alternateLocale = locale.value === 'en'
    ? 'pl'
    : 'en'
  const currentPath = route.path

  // Canonical and alternate language links
  useHead({
    link: [
      // Canonical URL
      {
        rel: 'canonical',
        href: canonical || absoluteUrl,
      },
      // Hreflang tags for bilingual content
      {
        rel: 'alternate',
        hreflang: locale.value,
        href: absoluteUrl,
      },
      {
        rel: 'alternate',
        hreflang: alternateLocale,
        href: `${config.public.siteUrl}${localePath(currentPath, alternateLocale)}`,
      },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${config.public.siteUrl}${localePath(currentPath, 'en')}`,
      },
    ],
    htmlAttrs: {
      lang: locale.value,
    },
  })

  return {
    title: finalTitle,
    description: finalDescription,
    image: absoluteImage,
    url: absoluteUrl,
  }
}
