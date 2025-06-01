import { collection, getDocs } from 'firebase/firestore'
import { type IProject, mapIProject } from '~/models/project'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<IProject[]>([])
  const loading = ref(false)

  const { firestore } = useFirebase()
  const projectsCollection = collection(firestore, 'projects')

  const fetchProjects = async () => {
    loading.value = true

    try {
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
    fetchProjects,
  }
})
