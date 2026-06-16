<script setup lang="ts">
import type { ITableOfContentsItem } from '~/models/blog'

const props = defineProps<{
  blogContent: string
  tableOfContents?: ITableOfContentsItem[]
  mainLanguage?: string
  hideToc?: boolean
}>()

const { blogContent, tableOfContents, mainLanguage, hideToc } = toRefs(props)

const { locale, t } = useI18n()

// Utility functions
function scrollToSection(id: string) {
  if (import.meta.server)
    return
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function copyText(text: string) {
  if (import.meta.server)
    return
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
        .replace(/<table([^>]*)>/g, '<div class="blog-table-wrapper"><table$1 class="blog-table">')
        .replace(/<\/table>/g, '</table></div>')
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

      // Process tables to remove internal newlines that would become <br> tags
        .replace(/(<div class="blog-table-wrapper"><table[\s\S]*?<\/table><\/div>)/g, (match) => {
          // Remove newlines within table structure but preserve the table content
          return match.replace(/\n\s*/g, ' ').replace(/\s+/g, ' ')
        })

      // Clean up extra whitespace around tables before converting newlines
        .replace(/\n+(<div class="blog-table-wrapper"><table[\s\S]*?<\/table><\/div>)\n+/g, '\n$1\n')
        .replace(/^(<div class="blog-table-wrapper"><table[\s\S]*?<\/table><\/div>)\n+/g, '$1\n')
        .replace(/\n+(<div class="blog-table-wrapper"><table[\s\S]*?<\/table><\/div>)$/g, '\n$1')

      // Line breaks (convert remaining newlines to <br>, but not within HTML tags)
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
      class="text-subtitle-1 text-warning px-2 py-4"
    >
      {{ $t('blog.languageWarning', {"language": getFromLanguage(mainLanguage)}) }}
    </div>

    <!-- Table of Contents -->
    <div
      v-if="!hideToc && tableOfContents && tableOfContents.length > 0"
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
      class="blog-text-container"
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
                class="font-weight-medium text-uppercase text-caption"
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
    font-size: 17px;
    line-height: 1.75;
    color: var(--text-muted);
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
    background: var(--bg-2) !important;
    border: 1px solid var(--accent-line) !important;
  }

  :deep(.blog-code-content) {
    background: var(--bg-2);
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
    margin: 1rem 0;
    background: rgb(var(--v-theme-surface));
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(var(--v-theme-primary), 0.15);
    display: table; /* Ensure proper table display */
    margin-top: 2rem;
    min-width: 100%;
  }

  /* Table wrapper for horizontal scrolling */
  :deep(.blog-table-wrapper) {
    overflow-x: auto;
    margin: 1rem 0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgba(var(--v-theme-primary), 0.15);
    /* Webkit scrollbar styling for better UX */
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--v-theme-primary), 0.3) transparent;
  }

  :deep(.blog-table-wrapper::-webkit-scrollbar) {
    height: 8px;
  }

  :deep(.blog-table-wrapper::-webkit-scrollbar-track) {
    background: rgba(var(--v-theme-surface-variant), 0.3);
    border-radius: 4px;
  }

  :deep(.blog-table-wrapper::-webkit-scrollbar-thumb) {
    background: rgba(var(--v-theme-primary), 0.3);
    border-radius: 4px;
  }

  :deep(.blog-table-wrapper::-webkit-scrollbar-thumb:hover) {
    background: rgba(var(--v-theme-primary), 0.5);
  }

  :deep(.blog-table-wrapper .blog-table) {
    margin: 0;
    border: none;
    box-shadow: none;
    border-radius: 0;
    min-width: max-content; /* Allow table to expand based on content */
    width: max-content; /* Ensure table can be wider than container */
  }

  /* Remove extra spacing around tables */
  :deep(br + .blog-table-wrapper),
  :deep(.blog-table-wrapper + br) {
    margin-top: 0;
  }

  :deep(.blog-table-wrapper + br + br) {
    display: none;
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
    min-width: 120px; /* Ensure minimum column width */
    min-height: 60px; /* Add minimum height for more spacious look */
    white-space: nowrap; /* Prevent header text wrapping */
  }

  :deep(.blog-td) {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid rgba(var(--v-theme-surface-variant), 0.5);
    vertical-align: top;
    line-height: 1.5;
    min-width: 120px; /* Ensure minimum column width */
    min-height: 50px; /* Add minimum height for more spacious look */
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
    font-family: var(--font-display);
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 500;
    letter-spacing: -0.025em;
    margin: 48px 0 16px;
    color: var(--text);
    scroll-margin-top: calc(var(--nav-h) + 20px);
  }

  :deep(.blog-h2) {
    font-family: var(--font-display);
    font-size: clamp(24px, 3vw, 32px);
    font-weight: 500;
    letter-spacing: -0.02em;
    margin: 48px 0 16px;
    color: var(--text);
    scroll-margin-top: calc(var(--nav-h) + 20px);
  }

  :deep(.blog-h2:first-child) {
    margin-top: 0;
  }

  :deep(.blog-h3) {
    font-family: var(--font-display);
    font-size: clamp(19px, 2.2vw, 23px);
    font-weight: 500;
    letter-spacing: -0.015em;
    margin: 34px 0 12px;
    color: var(--text);
    scroll-margin-top: calc(var(--nav-h) + 20px);
  }

  :deep(.blog-text-content p) {
    font-size: 17px;
    line-height: 1.75;
    color: var(--text-muted);
    margin-bottom: 18px;
  }

  :deep(.blog-text-content p b),
  :deep(.blog-text-content p strong) {
    color: var(--text);
    font-weight: 600;
  }

  :deep(blockquote) {
    margin: 24px 0;
    padding: 4px 0 4px 22px;
    border-left: 3px solid var(--accent);
    font-size: 19px;
    line-height: 1.6;
    color: var(--text);
    font-style: italic;
  }

  :deep(.blog-bold) {
    font-weight: 600;
    color: var(--text);
  }

  :deep(.blog-italic) {
    font-style: italic;
    color: var(--text-muted);
  }

  :deep(.blog-underline) {
    text-decoration: underline;
    text-decoration-color: var(--accent);
    text-underline-offset: 2px;
  }

  :deep(.blog-inline-code) {
    font-family: var(--font-code);
    font-size: 0.88em;
    background: var(--bg-2);
    border: 1px solid var(--line-soft);
    padding: 2px 6px;
    border-radius: 6px;
    color: var(--accent);
  }

  :deep(.blog-list) {
    margin: 0 0 18px;
    padding-left: 4px;
    list-style: none;
    display: grid;
    gap: 12px;
  }

  :deep(.blog-list-item) {
    position: relative;
    padding-left: 28px;
    font-size: 16.5px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  :deep(.blog-list-item::before) {
    content: "";
    position: absolute;
    left: 6px;
    top: 11px;
    width: 7px;
    height: 7px;
    border-radius: 2px;
    background: var(--accent);
  }

  :deep(.blog-numbered-list) {
    margin: 0 0 18px;
    padding-left: 4px;
    list-style: none;
    display: grid;
    gap: 12px;
    counter-reset: list-counter;
  }

  :deep(.blog-numbered-item) {
    position: relative;
    padding-left: 34px;
    font-size: 16.5px;
    line-height: 1.65;
    color: var(--text-muted);
    counter-increment: list-counter;
  }

  :deep(.blog-numbered-item::before) {
    content: counter(list-counter);
    position: absolute;
    left: 0;
    top: 1px;
    width: 20px;
    height: 20px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-soft);
    border: 1px solid var(--accent-line);
  }

  :deep(.blog-numbered-item b),
  :deep(.blog-numbered-item strong) {
    color: var(--text);
    font-weight: 600;
  }

  :deep(.blog-list-item b),
  :deep(.blog-list-item strong) {
    color: var(--text);
    font-weight: 600;
  }

  :deep(.blog-sublist-item) {
    position: relative;
    padding-left: 34px;
    font-size: 16px;
    line-height: 1.65;
    color: var(--text-muted);
    margin-left: 1rem;
  }

  :deep(.blog-sublist-item::before) {
    content: attr(data-number);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    position: absolute;
    left: 0;
    top: 1px;
    min-width: 2rem;
  }

  /* Responsive Design */
  @media (max-width: 600px) {
    :deep(.blog-image) {
      max-width: 80% !important;
      width: 80% !important;
    }

    .blog-text {
      font-size: 16px;
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

    :deep(.blog-table-wrapper) {
      margin: 0.75rem 0;
      position: relative;
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
