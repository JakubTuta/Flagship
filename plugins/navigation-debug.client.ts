export default defineNuxtPlugin(() => {
  const router = useRouter()

  // Override router methods to catch unwanted redirects
  const originalPush = router.push
  const originalReplace = router.replace

  router.push = function (to) {
    console.log('Router push called:', to)
    console.trace('Call stack:')

    return originalPush.call(this, to)
  }

  router.replace = function (to) {
    console.log('Router replace called:', to)
    console.trace('Call stack:')

    return originalReplace.call(this, to)
  }

  // Monitor route changes
  router.beforeEach((to, from, next) => {
    console.log('Route change:', {
      from: from.path,
      to: to.path,
      timestamp: new Date().toISOString(),
    })
    next()
  })

  // Check for automatic redirects after page load
  onMounted(() => {
    setTimeout(() => {
      const currentPath = router.currentRoute.value.path
      console.log('Path after 2 seconds:', currentPath)
      if (currentPath === '/' && window.location.pathname !== '/') {
        console.error('Unwanted redirect detected!')
        console.log('Expected:', window.location.pathname)
        console.log('Actual:', currentPath)
      }
    }, 2000)
  })
})
