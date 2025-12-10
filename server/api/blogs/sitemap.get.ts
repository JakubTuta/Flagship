/**
 * Server API route to fetch published blog IDs for sitemap generation
 * This ensures all blog posts are discoverable by search engines
 */

import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig()

    // Initialize Firebase Admin if not already initialized
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey?.replace(/\\n/g, '\n'),
        }),
      })
    }

    const firestore = getFirestore()

    // Fetch all published blogs
    const blogsSnapshot = await firestore
      .collection('blogs')
      .where('isPublished', '==', true)
      .select('value', 'publishDate') // Only fetch needed fields
      .get()

    // Map to sitemap-friendly format
    const blogRoutes = blogsSnapshot.docs.map((doc) => {
      const data = doc.data()

      return {
        url: `/blog/${data.value}`,
        lastmod: data.publishDate
          ? new Date(data.publishDate.toDate()).toISOString()
          : new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      }
    })

    return blogRoutes
  }
  catch (error) {
    console.error('Error fetching blog routes for sitemap:', error)

    // Return empty array on error to prevent sitemap generation failure
    return []
  }
})
