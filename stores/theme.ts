import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()
  const vuetifyTheme = useTheme()

  const currentTheme = computed(() => colorMode.value)

  watch(currentTheme, (newValue) => {
    vuetifyTheme.global.name.value = newValue
  }, { immediate: true })

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  const isDark = computed(() => currentTheme.value === 'dark')

  return {
    toggleTheme,
    isDark,
  }
})
