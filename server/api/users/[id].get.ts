import type { IUserSerialized } from '~/models/serialized'

export default defineEventHandler(async (event): Promise<IUserSerialized> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' })
  }

  try {
    const firestore = getAdminFirestore()
    const userDoc = await firestore.collection('users').doc(id).get()

    if (!userDoc.exists) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    const data = userDoc.data()!

    return {
      email: data.email || '',
      username: data.username || '',
    } satisfies IUserSerialized
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error fetching user:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch user' })
  }
})
