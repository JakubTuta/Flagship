export default defineEventHandler(async () => {
  try {
    const slugs = await listBlogSlugs()

    const routes = await Promise.all(
      slugs.map(async (slug) => {
        const meta = await readContentAsset<{ publishDate: string | null, isPublished: boolean }>(`blogs/${slug}/meta.json`)
        if (!meta || !meta.isPublished)
          return null

        return {
          url: `/blog/${slug}`,
          lastmod: meta.publishDate
            ? new Date(meta.publishDate).toISOString()
            : new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        }
      }),
    )

    return routes.filter(Boolean)
  }
  catch {
    return []
  }
})
