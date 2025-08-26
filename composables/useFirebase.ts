import type { Analytics } from 'firebase/analytics'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'

export function useFirebase() {
  const nuxtApp = useNuxtApp()

  // On server, these will be null, on client they will be the actual Firebase instances
  const firestore = nuxtApp.$firestore as Firestore | null
  const auth = nuxtApp.$auth as Auth | null
  const storage = nuxtApp.$storage as FirebaseStorage | null
  const analytics = nuxtApp.$analytics as Analytics | null

  return {
    firestore,
    auth,
    storage,
    analytics,
  }
}
