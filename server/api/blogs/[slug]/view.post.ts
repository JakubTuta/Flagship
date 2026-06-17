export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Blog slug is required' })
  }

  try {
    const meta = await readContentAsset<{ viewCount?: number }>(`blogs/${slug}/meta.json`)
    if (!meta) {
      throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
    }

    const storage = useStorage('views')
    const current = await storage.getItem<number>(slug) ?? meta.viewCount ?? 0
    await storage.setItem(slug, current + 1)

    return { success: true }
  }
  catch (error: any) {
    if (error.statusCode)
      throw error
    throw createError({ statusCode: 500, statusMessage: 'Failed to increment view count' })
  }
})
