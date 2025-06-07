import type { DocumentReference } from 'firebase/firestore'
import { decodeWhitespace, encodeWhitespace } from '~/helpers/translateText'

export interface IWorkingBlog {
  title: string
  value: string
  content: string
  links: string[]
  image: string | null
  category: TBlogCategory
  author: DocumentReference | null
  mainLanguage: string | null
  reference: DocumentReference | null
}

// From database to model
export function mapIWorkingBlogDecoded(data: Partial<IWorkingBlog>, reference?: DocumentReference | null): IWorkingBlog {
  return {
    title: data.title || '',
    value: data.value || '',
    content: decodeWhitespace(data.content || ''),
    links: data.links || [],
    image: data.image || null,
    category: data.category || 'other',
    author: data.author || null,
    mainLanguage: data.mainLanguage || null,
    reference: reference || null,
  }
}

// From model to database
export function mapIWorkingBlogEncoded(data: Partial<IWorkingBlog>, reference?: DocumentReference | null): IWorkingBlog {
  return {
    title: data.title || '',
    value: data.value || '',
    content: encodeWhitespace(data.content || ''),
    links: data.links || [],
    image: data.image || null,
    author: data.author || null,
    category: data.category || 'other',
    mainLanguage: data.mainLanguage || null,
    reference: reference || null,
  }
}
