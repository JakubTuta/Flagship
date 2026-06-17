import type { IProject } from '~/models/project'
import type { IProjectSerialized } from '~/models/serialized'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<IProject[]>([])
  const loading = ref(false)

  const resetState = () => {
    projects.value = []
    loading.value = false
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
      repos: p.repos ?? [],
      demoUrl: p.demoUrl,
      featured: p.featured,
      showOnHome: p.showOnHome,
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
    hydrateProjects,
  }
})
