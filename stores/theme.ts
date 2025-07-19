export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()

  const setTheme = (newTheme: 'light' | 'dark') => {
    colorMode.value = newTheme
  }

  const toggleTheme = () => {
    colorMode.value = colorMode.value === 'dark'
      ? 'light'
      : 'dark'
  }

  const isDark = computed(() => colorMode.value === 'dark')

  onMounted(() => {
    setTheme(colorMode.value as 'light' | 'dark')
  })

  return {
    setTheme,
    toggleTheme,
    isDark,
  }
})
