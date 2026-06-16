import type { Analytics } from 'firebase/analytics'
import type { Firestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'

export function useFirebase() {
  const nuxtApp = useNuxtApp()

  const firestore = nuxtApp.$firestore as Firestore | null
  const storage = nuxtApp.$storage as FirebaseStorage | null
  const analytics = nuxtApp.$analytics as Analytics | null

  return {
    firestore,
    storage,
    analytics,
  }
}
