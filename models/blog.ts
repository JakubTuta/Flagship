import type { DocumentReference } from 'firebase/firestore'

export interface IBlog {
  author: DocumentReference | null
  id: string
  title: string
  reference: DocumentReference | null
}

export function mapIBlog(data: Partial<IBlog>, reference?: DocumentReference): IBlog {
  return {
    author: data.author || null,
    id: data.id || '',
    title: data.title || '',
    reference: reference || null,
  }
}
