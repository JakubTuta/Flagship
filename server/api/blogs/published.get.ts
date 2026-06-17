import type { IBlogSerialized } from '~/models/serialized'
import type { ITocItem } from '~/models/toc'

export default defineEventHandler(async (): Promise<IBlogSerialized[]> => {
  try {
    const slugs = await listBlogSlugs()
    const viewsStorage = useStorage('views')

    const blogs = await Promise.all(
      slugs.map(async (slug): Promise<IBlogSerialized | null> => {
        const meta = await readContentAsset<Omit<IBlogSerialized, 'value' | 'content' | 'tableOfContents'>>(`blogs/${slug}/meta.json`)
        if (!meta || !meta.isPublished)
          return null

        const liveCount = await viewsStorage.getItem<number>(slug)
        const viewCount = liveCount ?? meta.viewCount ?? 0

        return {
          ...meta,
          value: slug,
          content: { en: '', pl: '' },
          tableOfContents: { en: [] as ITocItem[], pl: [] as ITocItem[] },
          viewCount,
        }
      }),
    )

    return blogs.filter((b): b is IBlogSerialized => b !== null)
  }
  catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch published blogs' })
  }
})
