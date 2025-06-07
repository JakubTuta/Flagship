import { type FirebaseAppSettings, type FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  if (!config.public.apiKey)
    throw new Error('Firebase API key is not defined in runtime config.')

  const firebaseOptions: FirebaseOptions = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
  }

  const firebaseConfig: FirebaseAppSettings = {

  }

  const app = initializeApp(firebaseOptions, firebaseConfig)

  const firestore = getFirestore(app)
  const storage = getStorage(app)
  const auth = getAuth(app)

  nuxtApp.provide(
    'firestore',
    firestore,
  )

  nuxtApp.provide(
    'storage',
    storage,
  )

  nuxtApp.provide(
    'auth',
    auth,
  )
})
