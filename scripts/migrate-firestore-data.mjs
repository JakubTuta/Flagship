/**
 * One-time migration: Firestore native export → clean JSON content files.
 *
 * Run: node scripts/migrate-firestore-data.mjs
 *
 * Outputs:
 *   server/content/blogs/{slug}.json  – one file per published blog
 *   server/content/projects.json      – all projects
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Firestore value decoder ──────────────────────────────────────────────────

function decodeValue(v) {
  if (v === null || v === undefined) return null
  if ('stringValue' in v) return v.stringValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return Number(v.doubleValue)
  if ('booleanValue' in v) return v.booleanValue
  if ('nullValue' in v) return null
  if ('timestampValue' in v) return v.timestampValue // keep as ISO string
  if ('referenceValue' in v) {
    // Extract the document ID from path: .../{collection}/{id}
    const parts = v.referenceValue.split('/')
    return parts[parts.length - 1]
  }
  if ('mapValue' in v) {
    const result = {}
    for (const [key, val] of Object.entries(v.mapValue.fields || {})) {
      result[key] = decodeValue(val)
    }
    return result
  }
  if ('arrayValue' in v) {
    return (v.arrayValue.values || []).map(decodeValue)
  }
  return null
}

function decodeDocument(doc) {
  const result = {}
  for (const [key, val] of Object.entries(doc.fields || {})) {
    result[key] = decodeValue(val)
  }
  return result
}

// ── Whitespace decoder (mirrors server/utils/whitespace.ts) ─────────────────

function decodeWhitespace(text) {
  if (!text || typeof text !== 'string') return text || ''
  return text
    .replace(/\|\|\|NEWLINE\|\|\|/g, '\n')
    .replace(/\|\|\|TAB\|\|\|/g, '\t')
    .replace(/\|\|\|CARRIAGE_RETURN\|\|\|/g, '\r')
    .replace(/\|\|\|SPACES_(\d+)\|\|\|/g, (_, count) => ' '.repeat(Number.parseInt(count)))
}

// ── Image URL rewriter ───────────────────────────────────────────────────────

const BASE_FILE_URL = 'https://files.jtuta.cloud/portfolio'

function rewriteImageUrl(url, section) {
  if (!url || typeof url !== 'string') return null
  if (url.startsWith('https://firebasestorage.googleapis.com')) {
    try {
      const parsed = new URL(url)
      const objectPath = decodeURIComponent(parsed.pathname.split('/o/')[1] || '')
      const basename = objectPath.split('/').pop()
      return `${BASE_FILE_URL}/${section}/${basename}`
    } catch {
      return null
    }
  }
  return url
}

// ── Blogs ────────────────────────────────────────────────────────────────────

console.log('Migrating blogs…')
const blogsRaw = JSON.parse(readFileSync(resolve(ROOT, 'firestore_data/firestore_blogs.json'), 'utf8'))
const blogsDir = resolve(ROOT, 'server/content/blogs')
mkdirSync(blogsDir, { recursive: true })

let blogCount = 0
for (const doc of blogsRaw.documents || []) {
  const data = decodeDocument(doc)

  if (!data.isPublished) continue
  const slug = data.value
  if (!slug) {
    console.warn('  Skipping blog with no slug')
    continue
  }

  const blog = {
    title: data.title || { en: '', pl: '' },
    value: slug,
    content: {
      en: decodeWhitespace(data.content?.en || ''),
      pl: decodeWhitespace(data.content?.pl || ''),
    },
    featured: data.featured || false,
    links: data.links || [],
    projects: (data.projects || []).filter(Boolean),
    image: rewriteImageUrl(data.image, 'blogs'),
    isPublished: true,
    publishDate: data.publishDate || null,
    author: null,
    tableOfContents: (data.tableOfContents || []).map(item => ({
      title: item.title || { en: '', pl: '' },
      id: item.id || '',
      mainLevel: Number(item.mainLevel) || 2,
      subLevel: item.subLevel != null ? Number(item.subLevel) : null,
    })),
    category: data.category || 'other',
    viewCount: Number(data.viewCount) || 0,
    mainLanguage: data.mainLanguage || null,
  }

  writeFileSync(
    resolve(blogsDir, `${slug}.json`),
    JSON.stringify(blog, null, 2),
    'utf8',
  )
  blogCount++
  console.log(`  ✓ ${slug}`)
}
console.log(`  Total: ${blogCount} blogs\n`)

// ── Projects ─────────────────────────────────────────────────────────────────

console.log('Migrating projects…')
// The Firestore export has a brace-positioning bug in learned arrays:
// }}}}}]} → }}}}]}} (one } was written before ] instead of after])
const projectsFileRaw = readFileSync(resolve(ROOT, 'firestore_data/firestore_projects.json'), 'utf8')
  .replace(/\}\}\}\}\}\]\}/g, '}}}}]}}')
const projectsRaw = JSON.parse(projectsFileRaw)

const projects = (projectsRaw.documents || []).map((doc) => {
  const data = decodeDocument(doc)

  return {
    title: data.title || '',
    value: data.value || '',
    shortDescription: data.shortDescription || { en: '', pl: '' },
    description: data.description || { en: '', pl: '' },
    url: data.url || '',
    demoUrl: data.demoUrl || null,
    featured: data.featured || false,
    category: data.category || '',
    technologies: data.technologies || [],
    learned: (data.learned || []).map(item =>
      typeof item === 'object' && item !== null ? item : { en: '', pl: '' },
    ),
    image: rewriteImageUrl(data.image, 'projects'),
  }
})

writeFileSync(
  resolve(ROOT, 'server/content/projects.json'),
  JSON.stringify(projects, null, 2),
  'utf8',
)
console.log(`  ✓ ${projects.length} projects\n`)

console.log('Done! Review output in server/content/ then delete firestore_data/')
