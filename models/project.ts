import type { ITranslatedText } from './translatedText'

export interface IProjectRepo {
  label: string
  url: string
}

export interface IProject {
  title: string
  value: string
  shortDescription: ITranslatedText // max 100 characters
  description: ITranslatedText // max 300 characters
  url: string
  repos?: IProjectRepo[] // multiple repos for a single multi-part project
  demoUrl: string | null
  featured: boolean
  showOnHome: boolean
  category: string
  technologies: string[] // max 10
  learned: ITranslatedText[] // max 10
  image: string | null
}

export function mapIProject(data: Partial<IProject>): IProject {
  return {
    title: data.title || '',
    value: data.value || '',
    shortDescription: data.shortDescription || { pl: '', en: '' },
    description: data.description || { pl: '', en: '' },
    url: data.url || '',
    repos: data.repos || [],
    demoUrl: data.demoUrl || null,
    featured: data.featured || false,
    showOnHome: data.showOnHome || false,
    category: data.category || '',
    technologies: data.technologies || [],
    learned: data.learned || [],
    image: data.image || null,
  }
}
