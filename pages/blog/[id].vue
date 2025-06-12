<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { IBlog } from '~/models/blog'
import type { IUser } from '~/models/user'

const route = useRoute()
const { locale, t } = useI18n()
const { mobile } = useDisplay()

const selectedBlog = ref<IBlog | null>(null)
const isLoading = ref(true)
const author = ref<IUser | null>(null)

const blogStore = useBlogStore()
const authStore = useAuthStore()

useSeo({
  url: '/blog',
  useTranslation: true,
  translationKey: 'seo.pages.blog',
})

// Computed properties for SEO
const blogTitle = computed(() => selectedBlog.value?.title[locale.value] || t('seo.pages.blog.title'),
)

const blogDescription = computed(() => {
  if (!selectedBlog.value)
    return t('seo.pages.blog.description')

  const content = selectedBlog.value.content[locale.value]
  if (!content)
    return t('seo.pages.blog.description')

  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim()

  return plainText.length > 160
    ? `${plainText.substring(0, 157)}...`
    : plainText
})

const blogImage = computed(() => selectedBlog.value?.image || null)
const blogUrl = computed(() => `/blog/${route.params.id}`)

// Update SEO when blog data changes
watch([selectedBlog, locale], () => {
  if (selectedBlog.value) {
    usePageHead({
      title: `${blogTitle.value} | ${t('seo.site.title')}`,
      meta: [
        {
          name: 'description',
          content: blogDescription.value,
        },
        {
          name: 'keywords',
          content: `${getCategoryTitle(selectedBlog.value.category)}, 
          blog, ${author.value?.username || ''}`,
        },
        {
          name: 'author',
          content: author.value?.username || t('blog.anonymous'),
        },
        {
          property: 'article:published_time',
          content: selectedBlog.value.publishDate
            ? new Date(selectedBlog.value.publishDate).toISOString()
            : '',
        },
        {
          property: 'article:author',
          content: author.value?.username || t('blog.anonymous'),
        },
        {
          property: 'article:section',
          content: getCategoryTitle(selectedBlog.value.category),
        },
        {
          property: 'og:title',
          content: `${blogTitle.value} | ${t('seo.site.title')}`,
        },
        {
          property: 'og:description',
          content: blogDescription.value,
        },
        {
          property: 'og:type',
          content: 'article',
        },
        {
          property: 'og:url',
          content: blogUrl.value,
        },
        ...(blogImage.value
          ? [{ property: 'og:image', content: blogImage.value }]
          : []),
        {
          name: 'twitter:card',
          content: blogImage.value
            ? 'summary_large_image'
            : 'summary',
        },
        {
          name: 'twitter:title',
          content: blogTitle.value,
        },
        {
          name: 'twitter:description',
          content: blogDescription.value,
        },
        ...(blogImage.value
          ? [{ name: 'twitter:image', content: blogImage.value }]
          : []),
      ],
    })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const blogId = route.params.id as string
    selectedBlog.value = await blogStore.getBlogUser(blogId)
    author.value = await authStore.getUserDataFromRef(selectedBlog.value?.author || null)
  }
  catch (error) {
    console.error('Error loading blog:', error)
  }
  finally {
    isLoading.value = false
  }
})

// Utility functions
function formatDate(date: Date | null) {
  if (!date)
    return ''

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function copyText(text: string) {
  navigator.clipboard.writeText(text)
}

function getFromLanguage(language: string | null) {
  const langMap = {
    pl: 'blog.fromPolish',
    en: 'blog.fromEnglish',
  }

  return t(langMap[language as keyof typeof langMap] || 'blog.fromUnknown')
}

function getCategoryTitle(category: string) {
  return blogCategoriesValues(t).find(cat => cat.value === category)?.title || category
}

// Simplified content processing - single function that handles everything
function processContent(content: string): Array<{ type: string, content: string, language?: string }> {
  if (!content)
    return []

  const blocks: Array<{ type: string, content: string, language?: string }> = []
  const parts = content.split(/(```[\s\S]*?```)/g)

  parts.forEach((part) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const match = part.match(/```(\w+)?\n([\s\S]*?)```/)
      if (match) {
        blocks.push({
          type: 'code-block',
          language: match[1] || '',
          content: match[2] || '',
        })
      }
    }
    else if (part.trim()) {
      let processedText = part
        // Text formatting
        .replace(/\*\*(.*?)\*\*/g, '<strong class="blog-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="blog-italic">$1</em>')
        .replace(/__(.*?)__/g, '<u class="blog-underline">$1</u>')
        .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')

        // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="blog-image" />')
        .replace(/<img([^>]*)>/g, (match, attrs) => {
          return attrs.includes('class=')
            ? match.replace(/class="[^"]*"/, 'class="blog-image"')
            : `<img${attrs} class="blog-image">`
        })

        // Lists
        .replace(/^- (.*$)/gm, '<li class="blog-list-item">$1</li>')
        .replace(/^(\d+)\.(\d+)\. (.*$)/gm, '<li class="blog-sublist-item" data-number="$1.$2">$3</li>')
        .replace(/^(\d+)\. (.*$)/gm, '<li class="blog-numbered-item" data-number="$1">$2</li>')
        .replace(/(<li class="blog-list-item">.*?<\/li>)(\s*<li class="blog-list-item">.*?<\/li>)*/gs, '<ul class="blog-list">$&</ul>')
        .replace(/(<li class="blog-numbered-item".*?<\/li>)(\s*<li class="blog-(?:numbered-item|sublist-item)".*?<\/li>)*/gs, '<ol class="blog-numbered-list">$&</ol>')

        // Line breaks
        .replace(/\n/g, '<br>')

      // Process headers with table of contents numbering
      if (selectedBlog.value?.tableOfContents) {
        processedText = processedText
          .replace(/<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/gi, (match, id, title) => {
            const tocItem = selectedBlog.value!.tableOfContents.find(item => item.id === id)
            const displayTitle = tocItem?.subLevel === null && tocItem
              ? `${tocItem.mainLevel}. ${tocItem.title[locale.value]}`
              : title.trim()

            return `<h2 id="${id}" class="blog-h2">${displayTitle}</h2>`
          })
          .replace(/<h3 id="([^"]+)"[^>]*>(.*?)<\/h3>/gi, (match, id, title) => {
            const tocItem = selectedBlog.value!.tableOfContents.find(item => item.id === id)
            const displayTitle = tocItem?.subLevel !== null && tocItem
              ? `${tocItem.mainLevel}.${tocItem.subLevel}. ${tocItem.title[locale.value]}`
              : title.trim()

            return `<h3 id="${id}" class="blog-h3">${displayTitle}</h3>`
          })
      }

      // Handle markdown headers (fallback)
      processedText = processedText
        .replace(/^# (.*$)/gm, '<h1 class="blog-h1">$1</h1>')
        .replace(/^## (.*$)/gm, (match, title) => {
          if (title.includes('<h2'))
            return match
          const id = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')

          return `<h2 id="${id}" class="blog-h2">${title}</h2>`
        })
        .replace(/^### (.*$)/gm, (match, title) => {
          if (title.includes('<h3'))
            return match
          const id = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')

          return `<h3 id="${id}" class="blog-h3">${title}</h3>`
        })

      blocks.push({ type: 'text', content: processedText })
    }
  })

  return blocks
}

// Single computed property for processed content
const contentBlocks = computed(() => {
  if (!selectedBlog.value?.content)
    return []
  const content = selectedBlog.value.content[locale.value]

  return content
    ? processContent(content)
    : []
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container class="blog-detail-page py-8">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="py-16 text-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />

      <p class="text-h6 mt-4">
        {{ $t('blog.loading') }}
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="!selectedBlog"
      class="py-16 text-center"
    >
      <v-icon
        size="64"
        color="error"
        class="mb-4"
      >
        mdi-alert-circle
      </v-icon>

      <h2 class="text-h4 mb-4">
        {{ $t('blog.notFound') }}
      </h2>

      <v-btn
        to="/blogs"
        color="primary"
        variant="elevated"
      >
        {{ $t('blog.backToBlogs') }}
      </v-btn>
    </div>

    <!-- Blog Content -->
    <div
      v-else
      class="blog-content"
    >
      <!-- Back Button -->
      <div class="d-flex mb-6 justify-end">
        <v-btn
          to="/blogs"
          variant="text"
          color="primary"
          prepend-icon="mdi-arrow-left"
        >
          {{ $t('blog.backToBlogs') }}
        </v-btn>
      </div>

      <!-- Blog Header -->
      <div
        class="blog-header mb-8"
        :class="[
          selectedBlog.image
            ? 'blog-header-with-image'
            : 'blog-header-gradient',
          {'h-80vh': mobile},
        ]"
        :style="selectedBlog.image
          ? {'backgroundImage': `url(${selectedBlog.image})`}
          : {}"
      >
        <div class="blog-header-overlay">
          <div class="blog-header-content">
            <h1 class="blog-title mb-4">
              {{ selectedBlog.title[locale] }}
            </h1>

            <!-- Blog Meta Information -->
            <v-row
              class="blog-meta mb-6"
              no-gutters
            >
              <v-col
                cols="12"
                sm="auto"
                class="d-flex align-center mb-sm-0 mb-2"
              >
                <v-icon
                  size="small"
                  class="mr-2"
                  color="on-primary"
                >
                  mdi-calendar
                </v-icon>

                <span class="text-body-2 text-on-primary">{{ formatDate(selectedBlog.publishDate) }}</span>
              </v-col>

              <v-col
                cols="12"
                sm="auto"
                class="d-flex align-center mb-sm-0 mb-2 sm:ml-6"
              >
                <v-icon
                  size="small"
                  class="mr-2"
                  color="on-primary"
                >
                  mdi-account
                </v-icon>

                <span class="text-body-2 text-on-primary">{{ author?.username || $t('blog.anonymous') }}</span>
              </v-col>

              <v-col
                cols="12"
                sm="auto"
                class="d-flex align-center sm:ml-6"
              >
                <v-icon
                  size="small"
                  class="mr-2"
                  color="on-primary"
                >
                  mdi-eye
                </v-icon>

                <span class="text-body-2 text-on-primary">{{ selectedBlog.viewCount }} {{ $t('blog.views') }}</span>
              </v-col>
            </v-row>

            <v-row
              class="mx-2 mb-6"
              dense
            >
              <!-- Featured Badge -->
              <v-col
                cols="12"
                sm="auto"
              >
                <v-chip
                  v-if="selectedBlog.featured"
                  color="warning"
                  variant="elevated"
                  prepend-icon="mdi-star"
                >
                  {{ $t('blog.featured1') }}
                </v-chip>
              </v-col>
              <!-- Category Badge -->
              <v-col
                cols="12"
                md="auto"
              >
                <v-chip
                  color="surface"
                  variant="elevated"
                  prepend-icon="mdi-tag"
                >
                  {{ getCategoryTitle(selectedBlog.category) }}
                </v-chip>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>

      <!-- Blog Content Card -->
      <v-card
        class="blog-content-card mb-8"
        elevation="2"
      >
        <!-- Language Warning -->
        <div
          v-if="selectedBlog.mainLanguage !== locale"
          class="text-subtitle-1 px-2 py-4"
        >
          {{ $t('blog.languageWarning', {"language": getFromLanguage(selectedBlog.mainLanguage)}) }}
        </div>

        <!-- Table of Contents -->
        <div
          v-if="selectedBlog.tableOfContents.length > 0"
          class="table-of-contents"
        >
          <v-card-title class="pb-2">
            <v-icon class="mr-2">
              mdi-format-list-bulleted
            </v-icon>
            {{ $t('blog.tableOfContents') }}
          </v-card-title>

          <v-divider class="mb-4" />

          <v-card-text class="pt-0">
            <v-list
              density="compact"
              bg-color="transparent"
              class="toc-list"
            >
              <v-list-item
                v-for="item in selectedBlog.tableOfContents"
                :key="item.id"
                class="toc-item"
                :class="{'toc-main': item.subLevel === null,
                         'toc-sub': item.subLevel !== null}"
                @click="scrollToSection(item.id)"
              >
                <v-list-item-title
                  class="toc-title"
                  :class="{'text-primary': item.subLevel === null,
                           'text-secondary': item.subLevel !== null}"
                >
                  <span class="toc-number">
                    {{ item.subLevel === null
                      ? `${item.mainLevel}.`
                      : `${item.mainLevel}.${item.subLevel}.` }}
                  </span>
                  {{ item.title[locale] }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider class="mb-0" />
        </div>

        <!-- Blog Content -->
        <v-card-text class="pa-8">
          <div class="blog-text">
            <template
              v-for="(block, index) in contentBlocks"
              :key="index"
            >
              <!-- Code blocks -->
              <v-card
                v-if="block.type === 'code-block'"
                class="blog-code-block-card mb-4 max-w-1000px"
                variant="outlined"
              >
                <v-card-title
                  class="d-flex justify-space-between align-center px-3 py-2"
                  style="font-size: 0.9em;"
                >
                  <span
                    v-if="block.language"
                    class="text-caption font-weight-medium text-uppercase"
                  >
                    {{ block.language }}
                  </span>

                  <v-btn
                    icon="mdi-content-copy"
                    variant="text"
                    size="x-small"
                    density="comfortable"
                    @click="copyText(block.content)"
                  >
                    <v-icon size="16">
                      mdi-content-copy
                    </v-icon>

                    <v-tooltip
                      text="Copy code"
                      location="top"
                      activator="parent"
                    />
                  </v-btn>
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-3">
                  <pre class="blog-code-content"><code>{{ block.content }}</code></pre>
                </v-card-text>
              </v-card>

              <!-- Regular text content -->
              <div
                v-else-if="block.type === 'text'"
                class="blog-text-content"
                v-html="block.content"
              />
            </template>
          </div>
        </v-card-text>
      </v-card>

      <!-- Links Section -->
      <v-card
        v-if="selectedBlog.links?.length"
        class="blog-links mb-8"
        variant="outlined"
      >
        <v-card-title class="pb-4">
          <v-icon class="mr-2">
            mdi-link
          </v-icon>
          {{ $t('blog.relatedLinks') }}
        </v-card-title>

        <v-card-text>
          <v-list bg-color="transparent">
            <v-list-item
              v-for="(link, index) in selectedBlog.links"
              :key="index"
              :href="link"
              target="_blank"
              rel="noopener noreferrer"
              class="max-w-200px px-0"
            >
              <template #prepend>
                <v-icon color="primary">
                  mdi-open-in-new
                </v-icon>
              </template>

              <v-list-item-title>{{ link }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- Related Projects -->
      <v-card
        v-if="selectedBlog.projects?.length"
        class="blog-projects"
        variant="outlined"
      >
        <v-card-title class="pb-4">
          <v-icon class="mr-2">
            mdi-code-braces
          </v-icon>
          {{ $t('blog.relatedProjects') }}
        </v-card-title>

        <v-card-text>
          <v-chip-group>
            <v-chip
              v-for="(project, index) in selectedBlog.projects"
              :key="index"
              color="primary"
              variant="outlined"
            >
              {{ project.id }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
/* All existing styles remain the same */
:deep(.blog-image) {
  width: 50% !important;
  height: auto;
  border-radius: 8px;
  margin: 1rem auto;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.blog-detail-page {
  max-width: 800px;
  margin: 0 auto;
}

.table-of-contents {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 16px 16px 0 0;
}

.toc-list {
  padding: 0;
}

.toc-item {
  cursor: pointer;
  border-radius: 8px;
  margin: 2px 0;
  transition: all 0.2s ease;
}

.toc-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
}

.toc-main {
  font-weight: 500;
}

.toc-sub {
  padding-left: 2rem !important;
  font-weight: 400;
}

.toc-title {
  font-size: 0.95rem;
  line-height: 1.4;
}

.toc-number {
  font-weight: 600;
  margin-right: 0.5rem;
  min-width: 2rem;
  display: inline-block;
}

.blog-header {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  align-items: center;
}

.blog-header-gradient {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}

.blog-header-with-image {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.blog-header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  padding: 2rem;
}

.blog-header-with-image .blog-header-overlay {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary-rgb), 0.8) 0%,
    rgba(var(--v-theme-secondary-rgb), 0.6) 100%
  );
}

.blog-header-content {
  width: 100%;
  color: rgb(var(--v-theme-on-primary));
}

.blog-title {
  font-size: 2.5rem;
  font-weight: 400;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-primary));
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.blog-meta {
  color: rgba(var(--v-theme-on-primary-rgb), 0.9);
}

.blog-content-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.blog-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface));
}

:deep(.blog-code-block-card) {
  border-radius: 12px !important;
  overflow: hidden;
  margin: 1.5rem 0;
}

:deep(.blog-code-content) {
  background: transparent;
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface));
  overflow-x: auto;
}

:deep(.blog-h1) {
  font-size: 2rem;
  font-weight: 500;
  margin: 2rem 0 1rem 0;
  color: rgb(var(--v-theme-primary));
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  padding-bottom: 0.5rem;
  scroll-margin-top: 100px;
}

:deep(.blog-h2) {
  font-size: 1.75rem;
  font-weight: 500;
  margin: 1.5rem 0 0.75rem 0;
  color: rgb(var(--v-theme-primary));
  scroll-margin-top: 100px;
}

:deep(.blog-h3) {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 1.25rem 0 0.5rem 0;
  color: rgb(var(--v-theme-secondary));
  scroll-margin-top: 100px;
}

:deep(.blog-bold) {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

:deep(.blog-italic) {
  font-style: italic;
  color: rgb(var(--v-theme-on-surface-variant));
}

:deep(.blog-underline) {
  text-decoration: underline;
  text-decoration-color: rgb(var(--v-theme-primary));
  text-underline-offset: 2px;
}

:deep(.blog-inline-code) {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.85em;
  font-weight: 500;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

:deep(.blog-list) {
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
}

:deep(.blog-list-item) {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

:deep(.blog-list-item::before) {
  content: '•';
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

:deep(.blog-numbered-list) {
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
  counter-reset: list-counter;
}

:deep(.blog-numbered-item) {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  counter-increment: list-counter;
}

:deep(.blog-numbered-item::before) {
  content: counter(list-counter) '.';
  color: rgb(var(--v-theme-secondary));
  font-weight: 600;
  position: absolute;
  left: 0;
  top: 0;
  min-width: 1.5rem;
}

:deep(.blog-sublist-item) {
  position: relative;
  padding-left: 3rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  margin-left: 1rem;
}

:deep(.blog-sublist-item::before) {
  content: attr(data-number);
  color: rgb(var(--v-theme-accent));
  font-weight: 500;
  position: absolute;
  left: 0;
  top: 0;
  min-width: 2.5rem;
}

@media (max-width: 600px) {
  :deep(.blog-image) {
    max-width: 80% !important;
    width: 80% !important;
  }

  .blog-title {
    font-size: 2rem;
  }

  .blog-text {
    font-size: 1rem;
  }

  .blog-header {
    min-height: 250px;
  }

  .blog-header-overlay {
    padding: 1.5rem;
  }

  .toc-sub {
    padding-left: 1rem !important;
  }

  .toc-number {
    min-width: 1.5rem;
  }

  :deep(.blog-h1) {
    font-size: 1.75rem;
  }

  :deep(.blog-h2) {
    font-size: 1.375rem;
  }

  :deep(.blog-h3) {
    font-size: 1.125rem;
  }

  .blog-meta .v-col {
    margin-left: 0 !important;
  }

  :deep(.blog-code-block-card) {
    margin: 1rem 0;
  }
}
</style>
