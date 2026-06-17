<script setup lang="ts">
import type { IBlogSerialized } from '~/models/serialized'

const route = useRoute()
const { locale, t } = useI18n()

const displayLocale = computed<'en' | 'pl'>(() => {
  const lang = route.query.lang
  if (lang === 'en' || lang === 'pl')
    return lang

  return locale.value as 'en' | 'pl'
})
const config = useRuntimeConfig()

const blogSlug = route.params.id as string

const { data: blogData, status: blogStatus } = useAsyncData(
  `blog-${blogSlug}`,
  () => $fetch<IBlogSerialized>(`/api/blogs/${blogSlug}`),
)

const isLoading = computed(() => blogStatus.value === 'pending')
const selectedBlog = computed(() => blogData.value)

function getCategoryTitle(category: string) {
  return blogCategoriesValues(t).find(cat => cat.value === category)?.title || category
}

const blogDescription = computed(() => {
  if (selectedBlog.value?.description) {
    return selectedBlog.value.description[displayLocale.value] || selectedBlog.value.description.en || t('seo.pages.blog.description')
  }

  return t('seo.pages.blog.description')
})

const { addArticle, addBreadcrumbs } = useStructuredData()

const blogTitle = computed(() => selectedBlog.value?.title[displayLocale.value] || selectedBlog.value?.title.en || t('seo.site.title'),
)

const absoluteImage = computed(() => {
  const img = selectedBlog.value?.image || '/images/profile.jpg'

  return img.startsWith('http')
    ? img
    : `${config.public.siteUrl}${img}`
})

const canonicalUrl = computed(() => `${config.public.siteUrl}/blog/${blogSlug}`)

useSeoMeta(() => ({
  'title': blogTitle.value,
  'description': blogDescription.value,
  'ogTitle': `${blogTitle.value} | Jakub Tutka | Developer Portfolio`,
  'ogDescription': blogDescription.value,
  'ogImage': absoluteImage.value,
  'ogImageAlt': blogTitle.value,
  'ogType': 'article',
  'ogSiteName': 'Jakub Tutka | Developer Portfolio',
  'ogLocale': locale.value === 'en'
    ? 'en_US'
    : 'pl_PL',
  'ogLocaleAlternate': locale.value === 'en'
    ? 'pl_PL'
    : 'en_US',
  'article:published_time': selectedBlog.value?.publishDate || undefined,
  'article:modified_time': selectedBlog.value?.publishDate || undefined,
  'article:author': 'Jakub Tutka',
  'twitterCard': selectedBlog.value?.image
    ? 'summary_large_image'
    : 'summary',
  'twitterTitle': blogTitle.value,
  'twitterDescription': blogDescription.value,
  'twitterImage': absoluteImage.value,
  'twitterSite': '@JakubTutka',
  'twitterCreator': '@JakubTutka',
  'keywords': selectedBlog.value?.category
    ? `${getCategoryTitle(selectedBlog.value.category)}, development, programming`
    : '',
  'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
}))

useHead(() => ({
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'en', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'pl', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl.value },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
}))

watch(() => selectedBlog.value, (currentBlog) => {
  if (!currentBlog)
    return

  addArticle({
    type: 'BlogPosting',
    headline: currentBlog.title[displayLocale.value] || currentBlog.title.en,
    description: blogDescription.value,
    image: currentBlog.image || `${config.public.siteUrl}/images/profile.jpg`,
    datePublished: currentBlog.publishDate || undefined,
    dateModified: currentBlog.publishDate || undefined,
    authorName: 'Jakub Tutka',
    authorUrl: config.public.siteUrl,
    category: getCategoryTitle(currentBlog.category),
    keywords: [getCategoryTitle(currentBlog.category), 'development', 'programming'],
  })

  addBreadcrumbs([
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blogs' },
    { name: currentBlog.title[displayLocale.value] || currentBlog.title.en },
  ])
}, { immediate: true })

onMounted(() => {
  if (selectedBlog.value) {
    setTimeout(() => {
      if (selectedBlog.value) {
        $fetch(`/api/blogs/${blogSlug}/view`, { method: 'POST' }).catch(() => {})
      }
    }, 1000 * 60)
  }
})

function formatDate(date: Date | string | null) {
  if (!date)
    return ''

  const dateObj = typeof date === 'string'
    ? new Date(date)
    : date

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

function getFromLanguage(language: string | null) {
  const langMap: Record<string, string> = {
    pl: 'blog.fromPolish',
    en: 'blog.fromEnglish',
  }

  return t(langMap[language as string] || 'blog.fromUnknown')
}

// Reading progress bar
const scrollProgress = ref(0)

// TOC scroll-spy
const activeTocId = ref<string>('')
let tocObserver: IntersectionObserver | null = null
let scrollCleanup: (() => void) | null = null

function setupTocObserver() {
  const toc = selectedBlog.value?.tableOfContents?.[displayLocale.value]
  if (!toc?.length)
    return

  tocObserver?.disconnect()
  tocObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeTocId.value = entry.target.id

          return
        }
      }
    },
    { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
  )

  nextTick(() => {
    selectedBlog.value?.tableOfContents?.[displayLocale.value]?.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el)
        tocObserver?.observe(el)
    })
  })
}

onMounted(() => {
  const updateProgress = () => {
    const el = document.documentElement
    const total = el.scrollHeight - el.clientHeight
    scrollProgress.value = total > 0
      ? el.scrollTop / total
      : 0
  }

  window.addEventListener('scroll', updateProgress, { passive: true })
  scrollCleanup = () => window.removeEventListener('scroll', updateProgress)

  setupTocObserver()
})

watch(selectedBlog, (val) => {
  if (!import.meta.server && val) {
    setupTocObserver()
  }
})

watch(displayLocale, () => {
  if (!import.meta.server) {
    setupTocObserver()
  }
})

onUnmounted(() => {
  scrollCleanup?.()
  tocObserver?.disconnect()
})
</script>

<template>
  <div
    class="progress"
    :style="{'transform': `scaleX(${scrollProgress})`}"
    aria-hidden="true"
  />

  <!-- Loading -->
  <div
    v-if="isLoading"
    class="wrap post-head py-16 text-center"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    />

    <p class="muted mt-4">
      {{ $t('blog.loading') }}
    </p>
  </div>

  <!-- Not found -->
  <div
    v-else-if="!selectedBlog"
    class="wrap post-head py-16 text-center"
  >
    <p
      class="text-h4 mb-4"
      style="color: var(--text);"
    >
      {{ $t('blog.notFound') }}
    </p>

    <NuxtLink
      to="/blogs"
      class="btn btn-primary"
    >
      {{ $t('blog.backToBlogs') }}
    </NuxtLink>
  </div>

  <!-- Article -->
  <article
    v-else
    class="wrap post-head"
  >
    <NuxtLink
      to="/blogs"
      class="back"
    >
      <v-icon
        size="15"
        aria-hidden="true"
      >
        mdi-arrow-left
      </v-icon>
      {{ $t('blog.backToBlogs') }}
    </NuxtLink>

    <!-- Meta row -->
    <div class="post-meta">
      <template v-if="selectedBlog.featured">
        <span class="badge">
          <v-icon
            size="12"
            aria-hidden="true"
          >
            mdi-star
          </v-icon>
          {{ $t('blog.featured1') }}
        </span>

        <span aria-hidden="true">·</span>
      </template>

      <span class="cat">{{ getCategoryTitle(selectedBlog.category) }}</span>

      <span aria-hidden="true">·</span>

      <span>{{ formatDate(selectedBlog.publishDate) }}</span>

      <span aria-hidden="true">·</span>

      <span>{{ selectedBlog.viewCount }} {{ $t('blog.views') }}</span>
    </div>

    <!-- Title -->
    <h1 class="post-title">
      {{ selectedBlog.title[displayLocale] }}
    </h1>

    <!-- Byline -->
    <div class="byline">
      <span
        class="av"
        aria-hidden="true"
      >JT</span>

      <span class="who">
        <b>Jakub Tutka</b>

        <span>{{ $t('landingPage.hero.info') }}</span>
      </span>
    </div>

    <!-- Cover image -->
    <div
      v-if="selectedBlog.image"
      class="post-cover"
    >
      <v-img
        :src="selectedBlog.image"
        :alt="`${selectedBlog.title[displayLocale]} - cover image`"
        cover
        width="100%"
        height="100%"
      />
    </div>

    <!-- Disclaimer -->
    <div
      v-if="selectedBlog.mainLanguage && selectedBlog.mainLanguage !== displayLocale"
      class="disclaimer"
    >
      <v-icon
        size="18"
        class="disclaimer-icon"
        aria-hidden="true"
      >
        mdi-information-outline
      </v-icon>

      <p>{{ $t('blog.languageWarning', {"language": getFromLanguage(selectedBlog.mainLanguage)}) }}</p>
    </div>

    <!-- Post layout: TOC sidebar + prose -->
    <div
      class="post-layout"
      :class="[{'post-layout--notoc': !selectedBlog.tableOfContents?.[displayLocale]?.length}]"
    >
      <!-- TOC sidebar -->
      <nav
        v-if="selectedBlog.tableOfContents?.[displayLocale]?.length"
        class="toc"
        aria-label="Table of contents"
      >
        <div class="toc-label">
          {{ $t('blog.tableOfContents') }}
        </div>

        <a
          v-for="item in selectedBlog.tableOfContents[displayLocale]"
          :key="item.id"
          :href="`#${item.id}`"
          :class="{'sub': item.subLevel !== null,
                   'active': activeTocId === item.id}"
        >
          {{ item.subLevel === null
            ? `${item.mainLevel}. ${item.title}`
            : `${item.mainLevel}.${item.subLevel}. ${item.title}` }}
        </a>
      </nav>

      <!-- Prose -->
      <div class="prose">
        <BlogContent
          :blog-content="selectedBlog.content[displayLocale]"
        />

        <!-- Related links -->
        <div
          v-if="selectedBlog.links?.length"
          class="related"
        >
          <h4>
            <v-icon
              size="14"
              aria-hidden="true"
            >
              mdi-link-variant
            </v-icon>
            {{ $t('blog.relatedLinks') }}
          </h4>

          <a
            v-for="(link, index) in selectedBlog.links"
            :key="index"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link }}
            <v-icon
              size="14"
              aria-hidden="true"
            >
              mdi-open-in-new
            </v-icon>
          </a>
        </div>

        <!-- Post footer -->
        <div class="post-foot">
          <NuxtLink
            to="/blogs"
            class="back"
            style="margin: 0;"
          >
            <v-icon
              size="15"
              aria-hidden="true"
            >
              mdi-arrow-left
            </v-icon>
            {{ $t('blog.allArticles') }}
          </NuxtLink>

          <a
            href="mailto:jakubtutka02@gmail.com"
            class="btn btn-ghost btn-sm"
          >
            {{ $t('blog.discussPost') }}
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 60;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  pointer-events: none;
}

.post-head {
  padding-top: clamp(28px, 4vw, 44px);
  padding-bottom: clamp(48px, 6vw, 80px);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-muted);
  transition: color 0.2s, gap 0.2s;
  margin-bottom: 28px;
  text-decoration: none;
}

.back:hover {
  color: var(--accent);
  gap: 12px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text-faint);
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.post-meta .cat {
  color: var(--accent);
}

.post-title {
  font-family: var(--font-display);
  font-size: clamp(34px, 5.5vw, 60px);
  letter-spacing: -0.035em;
  line-height: 1.04;
  max-width: 18ch;
  color: var(--text);
}

.byline {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
}

.byline .av {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 14px;
  color: var(--accent-ink);
  background: linear-gradient(145deg, var(--accent), var(--accent-2));
  flex-shrink: 0;
}

.byline .who b {
  font-size: 14.5px;
  display: block;
  color: var(--text);
}

.byline .who span {
  font-size: 12.5px;
  color: var(--text-faint);
  font-family: var(--font-mono);
}

.post-cover {
  margin-top: 32px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line);
  aspect-ratio: 21 / 9;
}

.disclaimer {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin: 32px 0 0;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--bg-1);
}

.disclaimer-icon {
  flex-shrink: 0;
  color: var(--accent);
  margin-top: 1px;
}

.disclaimer p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.post-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
  margin-top: clamp(40px, 5vw, 56px);
}

.post-layout--notoc {
  grid-template-columns: 1fr;
}

.toc {
  position: sticky;
  top: calc(var(--nav-h) + 24px);
}

.toc-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 14px;
}

.toc a {
  display: block;
  font-size: 13.5px;
  color: var(--text-muted);
  padding: 6px 0 6px 14px;
  border-left: 2px solid var(--line-soft);
  line-height: 1.35;
  transition: color 0.2s, border-color 0.2s;
  text-decoration: none;
}

.toc a.sub {
  padding-left: 26px;
  font-size: 12.5px;
  color: var(--text-faint);
}

.toc a:hover {
  color: var(--text);
}

.toc a.active {
  color: var(--accent);
  border-color: var(--accent);
}

.prose {
  max-width: 70ch;
  min-width: 0;
}

.related {
  margin-top: 44px;
  padding-top: 28px;
  border-top: 1px solid var(--line-soft);
}

.related h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}

.related a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 13.5px;
  color: var(--text-muted);
  margin-bottom: 8px;
  transition: all 0.2s;
  text-decoration: none;
  word-break: break-all;
}

.related a:hover {
  border-color: var(--accent-line);
  color: var(--accent);
  background: var(--accent-soft);
}

.post-foot {
  border-top: 1px solid var(--line-soft);
  margin-top: clamp(48px, 6vw, 72px);
  padding-top: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 860px) {
  .post-layout {
    grid-template-columns: 1fr;
  }

  .toc {
    position: static;
    margin-bottom: 8px;
  }

  .toc a {
    display: inline-block;
    border-left: none;
    padding-left: 0;
    padding-right: 12px;
  }

  .prose {
    max-width: 100%;
  }
}

@media (max-width: 560px) {
  .post-title {
    max-width: 100%;
  }
}
</style>
