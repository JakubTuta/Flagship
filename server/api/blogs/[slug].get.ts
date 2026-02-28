import type { IBlogSerialized } from '~/models/serialized'

export default defineEventHandler(async (event): Promise<IBlogSerialized> => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Blog slug is required' })
  }

  try {
    const firestore = getAdminFirestore()

    const blogsSnapshot = await firestore
      .collection('blogs')
      .where('value', '==', slug)
      .where('isPublished', '==', true)
      .limit(1)
      .get()

    if (blogsSnapshot.empty) {
      throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
    }

    const doc = blogsSnapshot.docs[0]
    const data = doc.data()

    return {
      title: data.title || { en: '', pl: '' },
      value: data.value || '',
      content: {
        en: decodeWhitespace(data.content?.en || ''),
        pl: decodeWhitespace(data.content?.pl || ''),
      },
      featured: data.featured || false,
      links: data.links || [],
      projects: (data.projects || []).map((ref: any) => ref?.id || ref),
      image: data.image || null,
      isPublished: true,
      publishDate: data.publishDate
        ? data.publishDate.toDate().toISOString()
        : null,
      author: data.author?.id || null,
      tableOfContents: data.tableOfContents || [],
      category: data.category || 'other',
      viewCount: data.viewCount || 0,
      mainLanguage: data.mainLanguage || null,
    } satisfies IBlogSerialized
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error fetching blog by slug:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch blog' })
  }
})
