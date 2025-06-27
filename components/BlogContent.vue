<script setup lang="ts">
import type { ITableOfContentsItem } from '~/models/blog';

const props = defineProps<{
  blogContent: string
  tableOfContents?: ITableOfContentsItem[]
  mainLanguage?: string
}>()

const { blogContent, tableOfContents, mainLanguage } = toRefs(props)

const { locale, t } = useI18n()

// Utility functions
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

// Content processing function
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

      // Links - enhanced to handle various link formats
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="blog-link" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/<a([^>]+)>/g, (match, attrs) => {
          // Add blog-link class to existing anchor tags if they don't have it
          return attrs.includes('class=')
            ? match.replace(/class="([^"]*)"/, 'class="$1 blog-link"')
            : `<a${attrs} class="blog-link">`
        })

      // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="blog-image" />')
        .replace(/<img([^>]*)>/g, (match, attrs) => {
          return attrs.includes('class=')
            ? match.replace(/class="[^"]*"/, 'class="blog-image"')
            : `<img${attrs} class="blog-image">`
        })

      // Tables - enhance table formatting
        .replace(/<table([^>]*)>/g, '<table$1 class="blog-table">')
        .replace(/<th([^>]*)>/g, '<th$1 class="blog-th">')
        .replace(/<td([^>]*)>/g, '<td$1 class="blog-td">')
        .replace(/<thead([^>]*)>/g, '<thead$1 class="blog-thead">')
        .replace(/<tbody([^>]*)>/g, '<tbody$1 class="blog-tbody">')

      // Lists
        .replace(/^- (.*$)/gm, '<li class="blog-list-item">$1</li>')
        .replace(/^(\d+)\.(\d+)\. (.*$)/gm, '<li class="blog-sublist-item" data-number="$1.$2">$3</li>')
        .replace(/^(\d+)\. (.*$)/gm, '<li class="blog-numbered-item" data-number="$1">$2</li>')
        .replace(/(<li class="blog-list-item">.*?<\/li>)(\s*<li class="blog-list-item">.*?<\/li>)*/gs, '<ul class="blog-list">$&</ul>')
        .replace(/(<li class="blog-numbered-item".*?<\/li>)(\s*<li class="blog-(?:numbered-item|sublist-item)".*?<\/li>)*/gs, '<ol class="blog-numbered-list">$&</ol>')

      // Line breaks
        .replace(/\n/g, '<br>')

      // Process headers with table of contents numbering
      if (tableOfContents.value?.length) {
        processedText = processedText
          .replace(/<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/gi, (match, id, title) => {
            const tocItem = tableOfContents.value!.find(item => item.id === id)
            const displayTitle = tocItem?.subLevel === null && tocItem
              ? `${tocItem.mainLevel}. ${tocItem.title[locale.value]}`
              : title.trim()

            return `<h2 id="${id}" class="blog-h2">${displayTitle}</h2>`
          })
          .replace(/<h3 id="([^"]+)"[^>]*>(.*?)<\/h3>/gi, (match, id, title) => {
            const tocItem = tableOfContents.value!.find(item => item.id === id)
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

// Computed property for processed content
const contentBlocks = computed(() => {
  if (!blogContent.value)
    return []

  return processContent(blogContent.value)
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="blog-content-wrapper">
    <!-- Language Warning -->
    <div
      v-if="mainLanguage !== undefined && mainLanguage !== locale"
      class="text-subtitle-1 px-2 py-4"
    >
      {{ $t('blog.languageWarning', {"language": getFromLanguage(mainLanguage)}) }}
    </div>

    <!-- Table of Contents -->
    <div
      v-if="tableOfContents && tableOfContents.length > 0"
      class="table-of-contents"
    >
      <v-card-title class="pb-2">
        <v-icon class="mr-2">
          mdi-format-list-bulleted
        </v-icon>
        {{ $t('blog.tableOfContents') }}
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-text
        v-if="tableOfContents && tableOfContents.length > 0"
        class="pt-0"
      >
        <v-list
          density="compact"
          bg-color="transparent"
          class="toc-list"
        >
          <v-list-item
            v-for="item in tableOfContents"
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
    <div
      class="blog-text-container pa-8"
    >
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
    </div>
  </div>
</template>

<style scoped>
  /* Table of Contents Styles */
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

  /* Blog Text Styles */
  .blog-text {
    font-size: 1.125rem;
    line-height: 1.7;
    color: rgb(var(--v-theme-on-surface));
  }

  /* Deep styles for content formatting */
  :deep(.blog-image) {
    width: 50% !important;
    height: auto;
    border-radius: 8px;
    margin: 1rem auto;
    display: block;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* Enhanced Code Block Styles */
  :deep(.blog-code-block-card) {
    border-radius: 12px !important;
    overflow: hidden;
    margin: 1.5rem 0;
    background: rgba(var(--v-theme-surface-variant-dark), 0.3) !important;
    border: 1px solid rgba(var(--v-theme-primary), 0.15) !important;
  }

  :deep(.blog-code-content) {
    background: rgba(var(--v-theme-surface-variant-dark), 0.5);
    margin: 0;
    padding: 1rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    /* Enhanced font stack for better code readability */
    font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Monaco', 'Consolas', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    color: rgb(var(--v-theme-on-surface));
    overflow-x: auto;
    border-radius: 8px;
    font-weight: 400;
    letter-spacing: 0.02em;
    /* Better text rendering for code */
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Link Styles */
  :deep(.blog-link) {
    color: rgb(var(--v-theme-primary));
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid rgba(var(--v-theme-primary), 0.3);
    padding-bottom: 1px;
    transition: all 0.2s ease;
    position: relative;
  }

  :deep(.blog-link:hover) {
    color: rgb(var(--v-theme-primary-darken-1));
    border-bottom-color: rgb(var(--v-theme-primary));
    background: rgba(var(--v-theme-primary), 0.05);
    padding: 2px 4px;
    border-radius: 4px;
    margin: 0 -2px;
  }

  :deep(.blog-link:visited) {
    color: rgb(var(--v-theme-secondary));
    border-bottom-color: rgba(var(--v-theme-secondary), 0.3);
  }

  :deep(.blog-link:visited:hover) {
    color: rgb(var(--v-theme-secondary-darken-1));
    border-bottom-color: rgb(var(--v-theme-secondary));
    background: rgba(var(--v-theme-secondary), 0.05);
  }

  /* Table Styles */
  :deep(.blog-table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    background: rgb(var(--v-theme-surface));
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(var(--v-theme-primary), 0.15);
  }

  :deep(.blog-thead) {
    background: rgba(var(--v-theme-primary), 0.1);
  }

  :deep(.blog-th) {
    padding: 1rem;
    text-align: center !important;
    vertical-align: middle !important;
    font-weight: 600 !important;
    color: rgb(var(--v-theme-primary));
    border-bottom: 2px solid rgba(var(--v-theme-primary), 0.2);
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  :deep(.blog-td) {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid rgba(var(--v-theme-surface-variant), 0.5);
    vertical-align: top;
    line-height: 1.5;
  }

  :deep(.blog-tbody tr:hover) {
    background: rgba(var(--v-theme-primary), 0.03);
  }

  :deep(.blog-tbody tr:nth-child(even)) {
    background: rgba(var(--v-theme-surface-variant), 0.3);
  }

  :deep(.blog-tbody tr:nth-child(even):hover) {
    background: rgba(var(--v-theme-primary), 0.05);
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
    font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Monaco', 'Consolas', monospace;
    font-size: 0.85em;
    font-weight: 500;
    border: 1px solid rgba(var(--v-theme-primary), 0.2);
    letter-spacing: 0.02em;
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

  /* Responsive Design */
  @media (max-width: 600px) {
    :deep(.blog-image) {
      max-width: 80% !important;
      width: 80% !important;
    }

    .blog-text {
      font-size: 1rem;
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

    :deep(.blog-code-block-card) {
      margin: 1rem 0;
    }

    :deep(.blog-code-content) {
      font-size: 0.8rem;
      padding: 0.75rem;
    }

    :deep(.blog-table) {
      font-size: 0.875rem;
    }

    :deep(.blog-th) {
      padding: 0.75rem 0.5rem;
      font-size: 0.85rem;
    }

    :deep(.blog-td) {
      padding: 0.625rem 0.5rem;
    }
  }
</style>
