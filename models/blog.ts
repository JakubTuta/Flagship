import type { DocumentReference } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { decodeWhitespace, encodeWhitespace } from '~/helpers/translateText'
import type { ITranslatedText } from '~/models/translatedText'

export interface IBlog {
  title: ITranslatedText
  value: string
  content: ITranslatedText
  featured: boolean
  links: string[]
  projects: DocumentReference[]
  image: string | null
  isPublished: boolean
  publishDate: Date | null
  author: DocumentReference | null
  reference: DocumentReference | null
}

// From database to model
export function mapIBlogDecoded(data: Partial<IBlog>, reference?: DocumentReference | null): IBlog {
  return {
    title: data.title || { en: '', pl: '' },
    value: data.value || '',
    content: {
      en: decodeWhitespace(data.content?.en || ''),
      pl: decodeWhitespace(data.content?.pl || ''),
    },
    featured: data.featured || false,
    links: data.links || [],
    projects: data.projects || [],
    image: data.image || null,
    isPublished: data.isPublished ?? true,
    publishDate: data.publishDate === null
      ? null
      : mapDate(data.publishDate),
    author: data.author || null,
    reference: reference || null,
  }
}

// From model to database
export function mapIBlogEncoded(data: Partial<IBlog>, reference?: DocumentReference | null): IBlog {
  return {
    title: data.title || { en: '', pl: '' },
    value: data.value || '',
    content: {
      en: encodeWhitespace(data.content?.en || ''),
      pl: encodeWhitespace(data.content?.pl || ''),
    },
    featured: data.featured || false,
    links: data.links || [],
    projects: data.projects || [],
    image: data.image || null,
    isPublished: data.isPublished || false,
    publishDate: data.publishDate === null
      ? null
      : mapDate(data.publishDate),
    author: data.author || null,
    reference: reference || null,
  }
}

function mapDate(date: Date | string | Timestamp | null | undefined): Date {
  if (date instanceof Date) {
    return date
  }
  else if (typeof date === 'string') {
    return new Date(date)
  }
  else if (date instanceof Timestamp) {
    return date.toDate()
  }
  else {
    return new Date()
  }
}
