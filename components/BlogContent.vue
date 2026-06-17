<script setup lang="ts">
const props = defineProps<{
  blogContent: string
}>()

const { blogContent } = toRefs(props)

const contentRef = ref<HTMLElement | null>(null)

function injectCopyButtons() {
  if (!contentRef.value)
    return

  contentRef.value.querySelectorAll('pre.shiki:not([data-copy-injected])').forEach((pre) => {
    pre.setAttribute('data-copy-injected', 'true')

    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.textContent = 'Copy'
    btn.type = 'button'
    btn.setAttribute('aria-label', 'Copy code')

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code')
      if (!code)
        return

      navigator.clipboard.writeText(code.textContent ?? '').then(() => {
        btn.textContent = 'Copied!'
        setTimeout(() => {
          btn.textContent = 'Copy'
        }, 2000)
      }).catch(() => {})
    })

    ;(pre as HTMLElement).style.position = 'relative'
    pre.appendChild(btn)
  })
}

onMounted(() => {
  injectCopyButtons()
})

watch(blogContent, async () => {
  await nextTick()
  injectCopyButtons()
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div
    ref="contentRef"
    class="blog-text-content"
    v-html="blogContent"
  />
</template>

<style>
.blog-text-content {
  font-size: 16px;
  line-height: 1.75;
  color: var(--text);
  word-break: break-word;
}

.blog-text-content h2 {
  font-family: var(--font-display);
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text);
  margin: 2.5em 0 0.75em;
  padding-bottom: 0.4em;
  border-bottom: 1px solid var(--line-soft);
}

.blog-text-content h3 {
  font-family: var(--font-display);
  font-size: clamp(18px, 2.5vw, 21px);
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--text);
  margin: 2em 0 0.6em;
}

.blog-text-content h2:first-child,
.blog-text-content h3:first-child {
  margin-top: 0;
}

.blog-text-content p {
  margin: 0 0 1.2em;
}

.blog-text-content ul,
.blog-text-content ol {
  padding-left: 1.5em;
  margin: 0.5em 0 1.2em;
}

.blog-text-content li {
  margin-bottom: 0.35em;
}

.blog-text-content li > ul,
.blog-text-content li > ol {
  margin: 0.25em 0;
}

.blog-text-content a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.15s;
}

.blog-text-content a:hover {
  opacity: 0.75;
}

.blog-text-content code:not(pre code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--bg-1);
  border: 1px solid var(--line-soft);
  border-radius: 4px;
  padding: 0.15em 0.4em;
  color: var(--accent);
  word-break: break-all;
}

.blog-text-content strong {
  font-weight: 700;
  color: var(--text);
}

.blog-text-content em {
  font-style: italic;
  color: var(--text-muted);
}

.blog-text-content blockquote {
  border-left: 3px solid var(--accent);
  margin: 1.5em 0;
  padding: 0.75em 1.25em;
  background: var(--accent-soft);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--text-muted);
  font-style: italic;
}

.blog-text-content blockquote p:last-child {
  margin-bottom: 0;
}

.blog-text-content hr {
  border: none;
  border-top: 1px solid var(--line-soft);
  margin: 2.5em 0;
}

.blog-text-content img {
  max-width: 100%;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-soft);
  display: block;
  margin: 1.5em auto;
}

/* GFM tables */
.blog-text-content table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin: 1.5em 0;
  overflow-x: auto;
  display: block;
}

.blog-text-content th {
  background: var(--bg-1);
  font-weight: 600;
  text-align: left;
  padding: 10px 14px;
  border: 1px solid var(--line-soft);
  color: var(--text);
}

.blog-text-content td {
  padding: 9px 14px;
  border: 1px solid var(--line-soft);
  color: var(--text-muted);
  vertical-align: top;
}

.blog-text-content tr:nth-child(even) td {
  background: var(--bg-0);
}

/* Shiki code blocks */
.blog-text-content pre.shiki {
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.6;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-soft);
  padding: 1.25em 1.5em;
  overflow-x: auto;
  margin: 1.5em 0;
  position: relative;
}

.blog-text-content pre.shiki code {
  font-family: inherit;
  font-size: inherit;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  word-break: normal;
}

/* Copy button */
.blog-text-content .copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid var(--line-soft);
  background: var(--bg-0);
  color: var(--text-faint);
  cursor: pointer;
  transition: all 0.15s;
  opacity: 0;
}

.blog-text-content pre.shiki:hover .copy-btn {
  opacity: 1;
}

.blog-text-content .copy-btn:hover {
  border-color: var(--accent-line);
  color: var(--accent);
}
</style>
