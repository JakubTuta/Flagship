import type { DocumentReference } from 'firebase/firestore'
import { decodeWhitespace, encodeWhitespace } from '~/helpers/translateText'

export interface IWorkingBlog {
  title: string
  value: string
  content: string
  links: string[]
  image: string | null
  author: DocumentReference | null
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
    author: data.author || null,
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
    reference: reference || null,
  }
}
