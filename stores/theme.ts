import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const defaultTheme = 'light'
  const key = 'tuta-theme'

  const theme = useTheme()
  const themeCookie = useCookie(key, { default: () => defaultTheme })

  theme.global.name.value = themeCookie.value

  const setTheme = (newTheme: string) => {
    theme.global.name.value = newTheme
    themeCookie.value = newTheme
  }

  const getTheme = () => {
    return themeCookie.value
  }

  const toggleTheme = () => {
    const currentTheme = theme.global.name.value
    const newTheme = currentTheme === 'light'
      ? 'dark'
      : 'light'
    setTheme(newTheme)
  }

  const isDark = computed(() => theme.global.name.value === 'dark')

  return {
    setTheme,
    getTheme,
    toggleTheme,
    isDark,
  }
})