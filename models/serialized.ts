import type { TBlogCategory } from '~/helpers/blogCategories'
import type { ITranslatedText } from '~/models/translatedText'

export interface ITableOfContentsItemSerialized {
  title: ITranslatedText
  id: string
  mainLevel: number
  subLevel: number | null
}

export interface IBlogSerialized {
  title: ITranslatedText
  value: string
  content: ITranslatedText
  featured: boolean
  links: string[]
  projects: string[]
  image: string | null
  isPublished: boolean
  publishDate: string | null
  author: string | null
  tableOfContents: ITableOfContentsItemSerialized[]
  category: TBlogCategory
  viewCount: number
  mainLanguage: 'pl' | 'en' | null
}

export interface IUserSerialized {
  email: string
  username: string
}

export interface IProjectSerialized {
  title: string
  value: string
  shortDescription: ITranslatedText
  description: ITranslatedText
  url: string
  demoUrl: string | null
  featured: boolean
  category: string
  technologies: string[]
  learned: ITranslatedText[]
  image: string | null
}

export interface IEducationSerialized {
  institution: ITranslatedText
  startDate: string
  endDate: string | null
  field: ITranslatedText
  specialization: ITranslatedText
  level: ITranslatedText
}

export interface IWorkExperienceSerialized {
  position: ITranslatedText
  company: string
  startDate: string
  endDate: string | null
  responsibilities: ITranslatedText[]
}

export interface IAdditionalActivitySerialized {
  title: ITranslatedText
  project: string
  startDate: string
  endDate: string | null
  activities: ITranslatedText[]
}

export interface IResumeSerialized {
  personalInfo: {
    name: string
    title: ITranslatedText
    email: string
    phone: string
    location: ITranslatedText
    birthDate: string
  }
  education: IEducationSerialized[]
  workExperience: IWorkExperienceSerialized[]
  additionalActivities: IAdditionalActivitySerialized[]
  skills: Array<{
    title: ITranslatedText
    skills: Array<{ name: string, color: string }>
  }>
  interests: Array<{
    name: ITranslatedText
    icon: string
    color: string
  }>
  links: Array<{
    name: ITranslatedText
    url: string
    icon: string
    color: string
  }>
  footerText: ITranslatedText
}
