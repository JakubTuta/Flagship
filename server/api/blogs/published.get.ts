import type { IBlogSerialized } from '~/models/serialized'

export default defineEventHandler(async (): Promise<IBlogSerialized[]> => {
  try {
    const firestore = getAdminFirestore()

    const blogsSnapshot = await firestore
      .collection('blogs')
      .where('isPublished', '==', true)
      .get()

    return blogsSnapshot.docs.map((doc) => {
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
    })
  }
  catch (error) {
    console.error('Error fetching published blogs:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch published blogs' })
  }
})
