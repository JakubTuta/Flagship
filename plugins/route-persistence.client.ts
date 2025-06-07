export default defineNuxtPlugin(() => {
  const router = useRouter()
  const route = useRoute()

  // Store the intended route on page load
  let initialRoute = route.fullPath

  // Prevent automatic redirects after hydration
  router.beforeEach((to, from, next) => {
    // If we're being redirected to home page right after hydration
    // and it's not an intentional navigation, stay on the current route
    if (to.path === '/' && from.path !== '/' && initialRoute !== '/') {
      // Check if this is happening within the first few seconds (hydration period)
      const hydrationTimeWindow = 3000 // 3 seconds
      const pageLoadTime = Date.now() - performance.timeOrigin

      if (pageLoadTime < hydrationTimeWindow) {
        // This is likely an unwanted redirect during hydration
        console.warn('Preventing hydration redirect from', initialRoute, 'to', to.path)
        next(false) // Cancel the navigation

        return
      }
    }

    next()
  })

  // Reset initial route after successful navigation
  router.afterEach(() => {
    // Reset after a delay to allow for hydration
    setTimeout(() => {
      initialRoute = route.fullPath
    }, 1000)
  })
})
