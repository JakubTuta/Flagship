import type { IBlogSerialized } from '~/models/serialized'

export default defineEventHandler(async () => {
  try {
    const keys = await listContentKeys('blogs')

    const routes = await Promise.all(
      keys.map(async (key) => {
        const blog = await readContentAsset<Pick<IBlogSerialized, 'value' | 'publishDate'>>(key)
        if (!blog) return null

        return {
          url: `/blog/${blog.value}`,
          lastmod: blog.publishDate
            ? new Date(blog.publishDate).toISOString()
            : new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        }
      }),
    )

    return routes.filter(Boolean)
  }
  catch (error) {
    console.error('Error fetching blog routes for sitemap:', error)
    return []
  }
})
