export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()
  const themeCookie = useCookie('tuta-theme', {
    default: () => 'light',
  })

  const setTheme = (newTheme: 'light' | 'dark') => {
    colorMode.value = newTheme
    themeCookie.value = newTheme
  }

  const toggleTheme = () => {
    const newTheme = colorMode.value === 'dark'
      ? 'light'
      : 'dark'
    setTheme(newTheme)
  }

  const isDark = computed(() => colorMode.value === 'dark')

  onMounted(() => {
    if (themeCookie.value) {
      setTheme(themeCookie.value as 'light' | 'dark')
    }
  })

  return {
    setTheme,
    toggleTheme,
    isDark,
  }
})
