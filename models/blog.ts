import type { ITranslatedText } from '~/models/translatedText'

export interface ITableOfContentsItem {
  title: ITranslatedText
  id: string
  mainLevel: number
  subLevel: number | null
}

export interface IBlog {
  title: ITranslatedText
  value: string
  content: ITranslatedText
  featured: boolean
  links: string[]
  projects: string[]
  image: string | null
  isPublished: boolean
  publishDate: Date | null
  author: string | null
  tableOfContents: ITableOfContentsItem[]
  category: TBlogCategory
  viewCount: number
  mainLanguage: 'pl' | 'en' | null
  reference: null
}
