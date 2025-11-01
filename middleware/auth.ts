export default defineNuxtRouteMiddleware(async () => {
  const { auth } = useFirebase()

  if (!auth)
    return navigateTo('/')

  await auth.authStateReady()

  if (!auth.currentUser)
    return navigateTo('/')
})
