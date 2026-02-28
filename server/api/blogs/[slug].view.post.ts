export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Blog slug is required' })
  }

  try {
    const { FieldValue } = await import('firebase-admin/firestore')
    const firestore = getAdminFirestore()

    const blogsSnapshot = await firestore
      .collection('blogs')
      .where('value', '==', slug)
      .limit(1)
      .get()

    if (blogsSnapshot.empty) {
      throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
    }

    const docRef = blogsSnapshot.docs[0].ref
    await docRef.update({ viewCount: FieldValue.increment(1) })

    return { success: true }
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error incrementing view count:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to increment view count' })
  }
})
