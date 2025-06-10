/* eslint-disable node/prefer-global/process */
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const defaultTheme = 'light'
  const key = 'tuta-theme'

  const theme = useTheme()

  // Enhanced cookie configuration for production
  const themeCookie = useCookie(key, {
    default: () => defaultTheme,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

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
    if (process.client) {
      const storedTheme = themeCookie.value
      if (storedTheme && storedTheme !== theme.global.name.value) {
        theme.global.name.value = storedTheme
      }
    }
  }

  // Auto-initialize when store is created on client
  if (process.client) {
    onMounted(() => {
      initTheme()
    })
  }

  return {
    setTheme,
    getTheme,
    toggleTheme,
    isDark,
    initTheme,
  }
})
