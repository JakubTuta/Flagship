export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()

  const setTheme = (newTheme: 'light' | 'dark') => {
    colorMode.preference = newTheme
  }

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  const isDark = computed(() => colorMode.value === 'dark')

  onMounted(() => {
    setTheme(colorMode.preference as 'light' | 'dark')
  })

  return {
    setTheme,
    toggleTheme,
    isDark,
  }
})