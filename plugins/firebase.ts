import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'
import type { FirebaseAppSettings, FirebaseOptions } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin({
  name: 'firebase',
  setup: async (nuxtApp) => {
    // Only initialize Firebase on the client side
    if (import.meta.server) {
      // Provide null values on server to prevent errors
      nuxtApp.provide('firestore', null)
      nuxtApp.provide('storage', null)
      nuxtApp.provide('auth', null)
      nuxtApp.provide('analytics', null)

      return
    }

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
      measurementId: config.public.measurementId,
    }

    const firebaseConfig: FirebaseAppSettings = {

    }

    const app = initializeApp(firebaseOptions, firebaseConfig)

    const firestore = getFirestore(app)
    const storage = getStorage(app)
    const auth = getAuth(app)

    let analytics = null
    try {
      const analyticsSupported = await isSupported()
      if (analyticsSupported) {
        analytics = getAnalytics(app)

        const router = useRouter()
        router.afterEach((to) => {
          nextTick(() => {
            logEvent(analytics!, 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: to.path,
            })
          })
        })
      }
      else {
        console.warn('Firebase Analytics is not supported in this environment')
      }
    }
    catch (error) {
      console.error('Failed to initialize Firebase Analytics:', error)
    }

    nuxtApp.provide('firestore', firestore)
    nuxtApp.provide('storage', storage)
    nuxtApp.provide('auth', auth)
    nuxtApp.provide('analytics', analytics)
  },
})
