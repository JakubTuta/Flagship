// This plugin ensures smooth hydration by initializing client-side state
export default defineNuxtPlugin({
  name: 'client-hydration',
  setup() {
    // Initialize stores that depend on client-side storage
    const _themeStore = useThemeStore()
    const _languageStore = useLanguageStore()

    // These will be initialized via onMounted in the stores
    // This plugin ensures stores are created early in hydration process
  },
})
