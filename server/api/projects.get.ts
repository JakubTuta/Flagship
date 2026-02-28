import type { IProjectSerialized } from '~/models/serialized'

export default defineEventHandler(async (): Promise<IProjectSerialized[]> => {
  try {
    const firestore = getAdminFirestore()

    const projectsSnapshot = await firestore.collection('projects').get()

    return projectsSnapshot.docs.map((doc) => {
      const data = doc.data()

      return {
        title: data.title || '',
        value: data.value || '',
        shortDescription: data.shortDescription || { en: '', pl: '' },
        description: data.description || { en: '', pl: '' },
        url: data.url || '',
        demoUrl: data.demoUrl || null,
        featured: data.featured || false,
        category: data.category || '',
        technologies: data.technologies || [],
        learned: data.learned || [],
        image: data.image || null,
      } satisfies IProjectSerialized
    })
  }
  catch (error) {
    console.error('Error fetching projects:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch projects' })
  }
})
