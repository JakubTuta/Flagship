import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  // The `useColorMode` composable from @nuxtjs/color-mode is the source of truth.
  const colorMode = useColorMode()
  const vuetifyTheme = useTheme()

  // Keep Vuetify's theme in sync with the color mode module.
  watch(colorMode, (newColorMode) => {
    vuetifyTheme.global.name.value = newColorMode.value
  }, { immediate: true })

  const toggleTheme = () => {
    // The module handles persistence and state changes.
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  const isDark = computed(() => colorMode.value === 'dark')

  return {
    toggleTheme,
    isDark,
  }
})