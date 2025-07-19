export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()
  const isHydrated = ref(false)

  const setTheme = (newTheme: 'light' | 'dark') => {
    // Only update colorMode.preference - let @nuxtjs/color-mode handle the rest
    colorMode.preference = newTheme
    
    // Save to localStorage for extra persistence
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('tuta-theme', newTheme)
    }
  }

  const toggleTheme = () => {
    // Use preference as source of truth, fallback to value
    const currentTheme = colorMode.preference || colorMode.value || 'light'
    const newTheme = currentTheme === 'dark'
      ? 'light'
      : 'dark'
    
    setTheme(newTheme)
  }

  // Safe computed property that handles undefined colorMode.value
  const isDark = computed(() => {
    // Check preference first, then value, then default to false
    const theme = colorMode.preference || colorMode.value
    
    return theme
      ? theme === 'dark'
      : false
  })

  onMounted(() => {
    // Sync localStorage with colorMode preference if needed
    if (typeof localStorage !== 'undefined') {
      const localTheme = localStorage.getItem('tuta-theme')
      
      if (localTheme && (localTheme === 'light' || localTheme === 'dark')) {
        // Only update if different from current preference
        if (colorMode.preference !== localTheme) {
          colorMode.preference = localTheme
        }
      }
      else if (colorMode.preference) {
        // Save current preference to localStorage
        localStorage.setItem('tuta-theme', colorMode.preference)
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
