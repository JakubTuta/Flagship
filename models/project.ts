import type { ITranslatedText } from './translatedText'

export interface IProject {
  title: string
  value: string
  shortDescription: ITranslatedText // max 100 characters
  description: ITranslatedText // max 300 characters
  url: string
  demoUrl: string | null
  featured: boolean
  category: string
  technologies: string[] // max 10
  learned: ITranslatedText[] // max 10
  tags: ITranslatedText[] // max 10
  image: string | null
}

export function mapIProject(data: Partial<IProject>): IProject {
  return {
    title: data.title || '',
    value: data.value || '',
    shortDescription: data.shortDescription || { pl: '', en: '' },
    description: data.description || { pl: '', en: '' },
    url: data.url || '',
    demoUrl: data.demoUrl || null,
    featured: data.featured || false,
    category: data.category || '',
    technologies: data.technologies || [],
    learned: data.learned || [],
    tags: data.tags || [],
    image: data.image || null,
  }
}
