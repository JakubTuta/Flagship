export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Blog slug is required' })
  }

  try {
    const blog = await readContentAsset<{ viewCount?: number }>(`blogs/${slug}`)
    if (!blog) {
      throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
    }

    const storage = useStorage('views')
    const current = await storage.getItem<number>(slug) ?? blog.viewCount ?? 0
    await storage.setItem(slug, current + 1)

    return { success: true }
  }
  catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error incrementing view count:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to increment view count' })
  }
})
