import { collection, getDocs } from 'firebase/firestore'
import { type IProject, mapIProject } from '~/models/project'

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

  return {
    projects,
    loading,
    resetState,
    fetchProjects,
  }
})
