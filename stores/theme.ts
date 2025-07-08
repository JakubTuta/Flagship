import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const defaultTheme = 'light'
  const key = 'tuta-theme'

  const theme = useTheme()
  const themeCookie = useCookie(key, {
    default: () => defaultTheme,
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  const currentTheme = useState(key, () => themeCookie.value)
  theme.global.name.value = currentTheme.value

  const setTheme = (newTheme: string) => {
    currentTheme.value = newTheme
    theme.global.name.value = newTheme
    themeCookie.value = newTheme
  }

  const getTheme = () => {
    return currentTheme.value
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