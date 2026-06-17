import type { IBlogSerialized } from '~/models/serialized'

export default defineEventHandler(async (event): Promise<IBlogSerialized> => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Blog slug is required' })
  }

  try {
    const meta = await readContentAsset<Omit<IBlogSerialized, 'value' | 'content' | 'tableOfContents'>>(`blogs/${slug}/meta.json`)

    if (!meta) {
      throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
    }

    const [enMd, plMd] = await Promise.all([
      readContentRaw(`blogs/${slug}/en.md`),
      readContentRaw(`blogs/${slug}/pl.md`),
    ])

    const [en, pl] = await Promise.all([
      renderMarkdown(enMd ?? '', `${slug}:en`, meta.title.en),
      renderMarkdown(plMd ?? '', `${slug}:pl`, meta.title.pl),
    ])

    const viewsStorage = useStorage('views')
    const liveCount = await viewsStorage.getItem<number>(slug)
    const viewCount = liveCount ?? meta.viewCount ?? 0

    return {
      ...meta,
      value: slug,
      content: { en: en.html, pl: pl.html },
      tableOfContents: { en: en.toc, pl: pl.toc },
      viewCount,
    }
  }
  catch (error: any) {
    if (error.statusCode)
      throw error
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch blog' })
  }
})
