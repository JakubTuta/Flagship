// This plugin ensures that the theme is properly initialized on the client
export default defineNuxtPlugin(() => {
  // Run after hydration to sync theme properly
  onMounted(() => {
    const colorMode = useColorMode()
    
    // Ensure the theme is properly initialized
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('tuta-theme')
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        // Force sync both preference and value after hydration
        if (colorMode.value !== savedTheme) {
          colorMode.preference = savedTheme
          colorMode.value = savedTheme
        }
      }
      else if (!colorMode.value) {
        // If no saved theme and colorMode is undefined, set to light
        colorMode.preference = 'light'
        colorMode.value = 'light'
      }
    }
  })
})
