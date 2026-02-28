import { collection, getDocs } from 'firebase/firestore'
import { type IProject, mapIProject } from '~/models/project'
import type { IProjectSerialized } from '~/models/serialized'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<IProject[]>([])
  const loading = ref(false)

  const { firestore } = useFirebase()

  const resetState = () => {
    projects.value = []
    loading.value = false
  }

  const fetchProjects = async () => {
    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return
    }

    loading.value = true

    try {
      const projectsCollection = collection(firestore, 'projects')
      const response = await getDocs(projectsCollection)
      projects.value = response.docs.map(doc => mapIProject(doc.data()))
    }
    catch (error) {
      console.error('Error fetching projects:', error)
    }
    finally {
      loading.value = false
    }
  }

  function hydrateProjects(serializedProjects: IProjectSerialized[]) {
    if (projects.value.length > 0) {
      return
    }

    projects.value = serializedProjects.map(p => ({
      title: p.title,
      value: p.value,
      shortDescription: p.shortDescription,
      description: p.description,
      url: p.url,
      demoUrl: p.demoUrl,
      featured: p.featured,
      category: p.category,
      technologies: p.technologies,
      learned: p.learned,
      image: p.image,
    }))
  }

  return {
    projects,
    loading,
    resetState,
    fetchProjects,
    hydrateProjects,
  }
})
