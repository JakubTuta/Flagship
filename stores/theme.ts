export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()
  const isHydrated = ref(false)

  const setTheme = (newTheme: 'light' | 'dark') => {
    // Update the color mode preference - this should trigger the @nuxtjs/color-mode
    colorMode.preference = newTheme
    
    // For immediate visual feedback, also set the value directly
    if (isHydrated.value) {
      colorMode.value = newTheme
    }

    // Save to localStorage for client persistence
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('tuta-theme', newTheme)
    }
  }

  const toggleTheme = () => {
    const currentTheme = colorMode.value || 'light'
    const newTheme = currentTheme === 'dark'
      ? 'light'
      : 'dark'
    setTheme(newTheme)
  }

  // Safe computed property that handles undefined colorMode.value
  const isDark = computed(() => {
    const theme = colorMode.value
    
    return theme
      ? theme === 'dark'
      : false
  })

  onMounted(() => {
    // Check if we have a localStorage preference
    if (typeof localStorage !== 'undefined') {
      const localTheme = localStorage.getItem('tuta-theme')
      if (localTheme && (localTheme === 'light' || localTheme === 'dark')) {
        // Update both preference and value for immediate effect
        if (colorMode.value !== localTheme) {
          colorMode.preference = localTheme
          colorMode.value = localTheme
        }
      }
    }

    isHydrated.value = true
  })

  return {
    setTheme,
    toggleTheme,
    isDark,
    isHydrated: readonly(isHydrated),
  }
})
