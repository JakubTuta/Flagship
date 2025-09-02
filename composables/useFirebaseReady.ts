export function useFirebaseReady() {
  const isReady = ref(false)

  const waitForFirebase = (): Promise<void> => {
    if (import.meta.server) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      const checkFirebase = () => {
        const { firestore } = useFirebase()
        if (firestore) {
          isReady.value = true
          resolve()
        }
        else {
          setTimeout(checkFirebase, 50)
        }
      }
      checkFirebase()
    })
  }

  const whenReady = async (callback: () => void | Promise<void>) => {
    if (import.meta.server) {
      return
    }

    await waitForFirebase()
    await callback()
  }

  return {
    isReady: readonly(isReady),
    waitForFirebase,
    whenReady,
  }
}
