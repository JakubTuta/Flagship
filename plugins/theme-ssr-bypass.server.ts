// Comprehensive theme management that completely avoids SSR theme detection

export default defineNuxtPlugin({
  name: 'theme-bypass-ssr',
  setup(_nuxtApp) {
    // Only run on server to disable theme detection during SSR
    if (import.meta.server) {
      // Force colorMode to always return 'light' during SSR
      const colorMode = useColorMode()

      // Override the colorMode behavior during SSR
      Object.defineProperty(colorMode, 'value', {
        get: () => 'light',
        enumerable: true,
        configurable: false,
      })

      Object.defineProperty(colorMode, 'preference', {
        get: () => 'light',
        set: () => {}, // Ignore any theme setting during SSR
        enumerable: true,
        configurable: false,
      })
    }
  },
})
