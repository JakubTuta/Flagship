import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import { createHighlighter } from 'shiki'
import type { ITocItem } from '~/models/toc'

export interface RenderedMarkdown {
  html: string
  toc: ITocItem[]
}

let _hlPromise: ReturnType<typeof createHighlighter> | null = null

function ensureHighlighter() {
  if (!_hlPromise) {
    _hlPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['bash', 'css', 'dockerfile', 'html', 'javascript', 'json', 'python', 'sql', 'typescript', 'yaml'],
    })
  }

  return _hlPromise
}

let _md: ReturnType<typeof markdownIt> | null = null

function buildMd(hl: Awaited<ReturnType<typeof createHighlighter>>) {
  if (_md)
    return _md

  _md = markdownIt({
    html: false,
    linkify: true,
    breaks: false,
    highlight(str, lang) {
      const supported = hl.getLoadedLanguages().includes(lang as never)
      try {
        return hl.codeToHtml(str, {
          lang: supported
            ? lang
            : 'text',
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: 'light-dark()',
        })
      }
      catch {
        return `<pre><code>${_md!.utils.escapeHtml(str)}</code></pre>`
      }
    },
  })

  _md.use(markdownItAnchor, {
    level: [2, 3],
    slugify: (str: string) => str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/\p{Mn}/gu, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/_/g, '-')
      .replace(/\s+/g, '-'),
  })

  const defaultLinkOpen: (tokens: any, idx: number, options: any, env: any, self: any) => string
    = _md.renderer.rules.link_open

      || ((tokens: any, idx: number, options: any, _env: any, self: any) => self.renderToken(tokens, idx, options))

  _md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href') || ''
    if (/^https?:\/\//.test(href)) {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noopener noreferrer')
    }

    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  return _md
}

function extractToc(tokens: ReturnType<ReturnType<typeof markdownIt>['parse']>): ITocItem[] {
  const toc: ITocItem[] = []
  let mainLevel = 0
  let subLevel = 0

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type !== 'heading_open')
      continue
    if (token.tag !== 'h2' && token.tag !== 'h3')
      continue

    const id = token.attrGet('id') ?? ''
    const inline = tokens[i + 1]
    const title = (inline?.children ?? [])
      .filter(t => t.type === 'text' || t.type === 'code_inline')
      .map(t => t.content)
      .join('')

    if (token.tag === 'h2') {
      mainLevel++
      subLevel = 0
      toc.push({ id, title, mainLevel, subLevel: null })
    }
    else {
      subLevel++
      toc.push({ id, title, mainLevel, subLevel })
    }
  }

  return toc
}

const renderCache = new Map<string, RenderedMarkdown>()

export async function renderMarkdown(source: string, cacheKey?: string): Promise<RenderedMarkdown> {
  if (cacheKey) {
    const cached = renderCache.get(cacheKey)
    if (cached)
      return cached
  }

  const hl = await ensureHighlighter()
  const md = buildMd(hl)

  const tokens = md.parse(source, {})
  const toc = extractToc(tokens)
  const html = md.render(source)

  const result: RenderedMarkdown = { html, toc }
  if (cacheKey)
    renderCache.set(cacheKey, result)

  return result
}
