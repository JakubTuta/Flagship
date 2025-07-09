import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  type themes = 'light' | 'dark'

  const vuetifyTheme = useTheme()
  const themeCookie = useCookie<themes>('tuta-theme', {
    default: () => 'light',
    // eslint-disable-next-line node/prefer-global/process
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  })

  const setTheme = (newTheme: themes) => {
    vuetifyTheme.global.name.value = newTheme
    themeCookie.value = newTheme
  }

  const toggleTheme = () => {
    const newTheme = vuetifyTheme.global.name.value === 'light'
      ? 'dark'
      : 'light'
    setTheme(newTheme)
  }

  const isDark = computed(() => vuetifyTheme.global.name.value === 'dark')

  onMounted(() => {
    if (themeCookie.value) {
      setTheme(themeCookie.value)
    }
  })

  return {
    setTheme,
    toggleTheme,
    isDark,
  }
})
