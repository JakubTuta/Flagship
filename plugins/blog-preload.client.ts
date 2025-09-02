export default defineNuxtPlugin(async () => {
  // Only run on client-side and for blog routes
  if (import.meta.server)
    return

  const route = useRoute()
  const blogStore = useBlogStore()

  // Preload published blogs for blog routes to improve SEO and performance
  if (route.path.startsWith('/blog')) {
    try {
      await blogStore.fetchPublishedBlogs()
    }
    catch (error) {
      console.error('Error preloading published blogs:', error)
    }
  }
})
