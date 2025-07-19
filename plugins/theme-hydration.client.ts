export default defineNuxtPlugin(() => {
  // This plugin only runs on client-side to prevent hydration mismatches
  const colorMode = useColorMode()

  // Ensure theme consistency after hydration
  onMounted(() => {
    const currentTheme = colorMode.value === 'dark'
      ? 'dark'
      : 'light'

    // Force sync theme to prevent any visual inconsistencies
    if (document && document.documentElement) {
      document.documentElement.setAttribute('data-theme', currentTheme)
      document.documentElement.className = document.documentElement.className
        .replace(/\b(light|dark)-mode\b/g, '')
      document.documentElement.classList.add(`${currentTheme}-mode`)
    }
  })
})
