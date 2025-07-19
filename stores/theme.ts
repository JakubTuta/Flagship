export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()
  const isHydrated = ref(false)

  const setTheme = (newTheme: 'light' | 'dark') => {
    colorMode.preference = newTheme

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

  const isDark = computed(() => colorMode.value === 'dark')

  onMounted(() => {
    if (typeof localStorage !== 'undefined') {
      const localTheme = localStorage.getItem('tuta-theme')
      if (localTheme && (localTheme === 'light' || localTheme === 'dark')) {
        if (colorMode.value !== localTheme) {
          colorMode.preference = localTheme
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
