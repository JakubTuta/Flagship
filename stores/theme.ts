export const useThemeStore = defineStore('theme', () => {
  const customTheme = useCustomTheme()

  // Initialize theme system
  if (import.meta.client) {
    customTheme.initialize()
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    customTheme.setTheme(newTheme)
  }

  const toggleTheme = () => {
    customTheme.toggleTheme()
  }

  const isDark = computed(() => customTheme.isDark.value)

  const getTheme = () => {
    return customTheme.currentTheme.value
  }

  return {
    setTheme,
    toggleTheme,
    isDark,
    getTheme,
  }
})
