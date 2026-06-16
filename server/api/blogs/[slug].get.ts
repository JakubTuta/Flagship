import type { IBlogSerialized } from '~/models/serialized'

export default defineEventHandler(async (event): Promise<IBlogSerialized> => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Blog slug is required' })
  }

  try {
    const blog = await readContentAsset<IBlogSerialized>(`blogs/${slug}`)

    if (!blog) {
      throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
    }

    const viewsStorage = useStorage('views')
    const liveCount = await viewsStorage.getItem<number>(slug)
    const viewCount = liveCount ?? blog.viewCount ?? 0

    return { ...blog, viewCount }
  }
  catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching blog by slug:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch blog' })
  }
})
