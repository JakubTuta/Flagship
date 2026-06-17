import type { TBlogCategory } from '~/helpers/blogCategories'
import type { ITocItem } from '~/models/toc'
import type { ITranslatedText } from '~/models/translatedText'

export interface IBlog {
  title: ITranslatedText
  description: ITranslatedText
  value: string
  content: ITranslatedText
  featured: boolean
  links: string[]
  projects: string[]
  image: string | null
  isPublished: boolean
  publishDate: Date | null
  author: string | null
  tableOfContents: { en: ITocItem[], pl: ITocItem[] }
  category: TBlogCategory
  viewCount: number
  mainLanguage: 'pl' | 'en' | null
}
