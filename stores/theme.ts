export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()

  const setTheme = (newTheme: 'light' | 'dark') => {
    colorMode.preference = newTheme
  }

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark'
      ? 'light'
      : 'dark'
  }

  const isDark = computed(() => colorMode.value === 'dark')

  const getTheme = () => {
    return colorMode.value === 'dark'
      ? 'dark'
      : 'light'
  }

  return {
    setTheme,
    toggleTheme,
    isDark,
    getTheme,
  }
})
