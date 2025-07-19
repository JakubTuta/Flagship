export default defineNuxtPlugin({
  name: 'theme-hydration-fix',
  setup() {
    // This plugin only runs on client-side to prevent hydration mismatches
    const colorMode = useColorMode()

    // Fix theme immediately after hydration
    const fixThemeAfterHydration = () => {
      const actualTheme = colorMode.value === 'dark'
        ? 'dark'
        : 'light'

      // Update document classes and attributes for consistency
      if (document && document.documentElement) {
        document.documentElement.setAttribute('data-theme', actualTheme)

        // Remove any existing theme classes
        document.documentElement.className = document.documentElement.className
          .replace(/\b(light|dark)-mode\b/g, '')

        // Add the correct theme class
        document.documentElement.classList.add(`${actualTheme}-mode`)

        // Update the color-scheme CSS property
        document.documentElement.style.colorScheme = actualTheme
      }
    }

    // Run on client hydration with a small delay to ensure everything is ready
    onMounted(() => {
      nextTick(() => {
        fixThemeAfterHydration()
      })
    })

    // Also watch for theme changes
    watch(colorMode, () => {
      if (import.meta.client) {
        nextTick(() => {
          fixThemeAfterHydration()
        })
      }
    }, { immediate: false })
  },
})
