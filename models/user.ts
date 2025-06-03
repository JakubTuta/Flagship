import type { DocumentReference } from 'firebase/firestore'

export interface IUser {
  email: string
  username: string
  reference: DocumentReference | null
}

export function mapIUser(data: Partial<IUser>, reference?: DocumentReference): IUser {
  return {
    email: data.email || '',
    username: data.username || '',
    reference: reference || null,
  }
}
