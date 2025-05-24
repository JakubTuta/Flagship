import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const defaultTheme = 'light'
  const theme = useTheme()

  const setTheme = (newTheme: string) => {
    theme.global.name.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const getTheme = () => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      theme.global.name.value = storedTheme
    }
    else {
      theme.global.name.value = defaultTheme
    }

    return theme.global.name.value
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
