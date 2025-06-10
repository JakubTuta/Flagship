import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const defaultTheme = 'light'
  const key = 'tuta-theme'

  const theme = useTheme()
  const themeCookie = useCookie(key, { default: () => defaultTheme })

  const setTheme = (newTheme: string) => {
    theme.global.name.value = newTheme
    themeCookie.value = newTheme
  }

  const getTheme = () => {
    const storedTheme = themeCookie.value
    theme.global.name.value = storedTheme

    return storedTheme
  }

  const toggleTheme = () => {
    const currentTheme = theme.global.name.value
    const newTheme = currentTheme === 'light'
      ? 'dark'
      : 'light'
    setTheme(newTheme)
  }

  const isDark = computed(() => theme.global.name.value === 'dark')

  // Initialize theme on client-side to prevent hydration mismatch
  const initTheme = () => {
    if (import.meta.client) {
      const storedTheme = themeCookie.value
      if (storedTheme && storedTheme !== theme.global.name.value) {
        theme.global.name.value = storedTheme
      }
    }
  }

  onMounted(() => {
    initTheme()
  })

  return {
    setTheme,
    getTheme,
    toggleTheme,
    isDark,
  }
})
