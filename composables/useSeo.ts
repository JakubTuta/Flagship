interface SeoOptions {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_status' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'
  publishedTime?: string
  author?: string
  tags?: string[]
  useTranslation?: boolean
  translationKey?: string
}

export function useSeo(options: SeoOptions = {}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const { t, locale } = useI18n()

  const {
    title,
    description,
    image = `${config.public.siteUrl}/og-default.jpg`,
    url = `${config.public.siteUrl}${route.path}`,
    type = 'website',
    publishedTime,
    author,
    tags = [],
    useTranslation = false,
    translationKey = '',
  } = options

  const finalTitle = useTranslation && translationKey
    ? t(`${translationKey}.title`)
    : title || t('seo.site.title')

  const finalDescription = useTranslation && translationKey
    ? t(`${translationKey}.description`)
    : description || t('seo.site.description')

  useSeoMeta({
    title: finalTitle,
    description: finalDescription,
    ogTitle: `${finalTitle} | ${t('seo.site.title')}`,
    ogDescription: finalDescription,
    ogImage: image,
    ogUrl: url,
    ogType: type,
    ogLocale: locale.value,
    ...(publishedTime && { 'article:published_time': publishedTime }),
    ...(author && { 'article:author': author }),
    ...(tags.length && { 'article:tag': tags.join(', ') }),
  })

  const localePath = useLocalePath()
  useHead({
    link: [
      { rel: 'canonical', href: `${config.public.siteUrl}${localePath(route.path)}` },
    ],
  })
}
