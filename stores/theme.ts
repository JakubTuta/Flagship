export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()
  
  // Use reactive state that starts with default value for SSR
  const theme = ref<'light' | 'dark'>('light')

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    colorMode.value = newTheme
    
    // Only access localStorage on client side
    if (import.meta.client) {
      localStorage.setItem('tuta-theme', newTheme)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'dark'
      ? 'light'
      : 'dark'
    setTheme(newTheme)
  }

  const isDark = computed(() => theme.value === 'dark')

  // Initialize theme from localStorage on client side only
  onMounted(() => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('tuta-theme')
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme)
      }
      else {
        // Fallback to system preference if no saved theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark
          ? 'dark'
          : 'light')
      }
    }
  })

  return {
    setTheme,
    toggleTheme,
    isDark,
    theme: readonly(theme),
  }
})
