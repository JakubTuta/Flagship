import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const defaultTheme = 'light'
  const theme = useTheme()
  const isHydrated = ref(false)

  const setTheme = (newTheme: string) => {
    theme.global.name.value = newTheme
    if (isHydrated.value) {
      localStorage.setItem('theme', newTheme)
    }
  }

  const getTheme = () => {
    if (!isHydrated.value) {
      return defaultTheme
    }

    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      theme.global.name.value = storedTheme

      return storedTheme
    }

    theme.global.name.value = defaultTheme

    return defaultTheme
  }

  const toggleTheme = () => {
    const currentTheme = theme.global.name.value
    const newTheme = currentTheme === 'light'
      ? 'dark'
      : 'light'
    setTheme(newTheme)
  }

  const isDark = computed(() => theme.global.name.value === 'dark')

  // Initialize after hydration
  onMounted(() => {
    isHydrated.value = true
    getTheme()
  })

  return {
    setTheme,
    getTheme,
    toggleTheme,
    isDark,
    isHydrated,
  }
})
