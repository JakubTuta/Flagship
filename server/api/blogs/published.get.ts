import type { IBlogSerialized } from '~/models/serialized'

export default defineEventHandler(async (): Promise<IBlogSerialized[]> => {
  try {
    const keys = await listContentKeys('blogs')
    const viewsStorage = useStorage('views')

    const blogs = await Promise.all(
      keys.map(async (key) => {
        const blog = await readContentAsset<IBlogSerialized>(key)
        if (!blog) return null

        const liveCount = await viewsStorage.getItem<number>(blog.value)
        const viewCount = liveCount ?? blog.viewCount ?? 0

        return {
          ...blog,
          content: { en: '', pl: '' },
          viewCount,
        } satisfies IBlogSerialized
      }),
    )

    return blogs.filter((b): b is IBlogSerialized => b !== null)
  }
  catch (error) {
    console.error('Error fetching published blogs:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch published blogs' })
  }
})
