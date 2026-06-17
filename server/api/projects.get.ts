import type { IProjectSerialized } from '~/models/serialized'

export default defineEventHandler(async (): Promise<IProjectSerialized[]> => {
  try {
    const projects = await readContentAsset<IProjectSerialized[]>('projects')

    return projects ?? []
  }
  catch (error) {
    console.error('Error fetching projects:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch projects' })
  }
})
