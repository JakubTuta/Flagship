import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          dark: false,
          colors: {
            // Primary colors - sage green
            'primary': 'rgb(106, 127, 83)', // Darker sage for better contrast
            'primary-lighten-1': 'rgb(142, 147, 108)', // Your original color
            'primary-lighten-2': 'rgb(168, 176, 140)',
            'primary-darken-1': 'rgb(85, 102, 66)',
            'primary-darken-2': 'rgb(64, 77, 50)',

            // Secondary colors - muted purple
            'secondary': 'rgb(89, 82, 127)', // Darker purple for better contrast
            'secondary-lighten-1': 'rgb(113, 108, 147)', // Your original color
            'secondary-lighten-2': 'rgb(140, 136, 168)',
            'secondary-darken-1': 'rgb(71, 66, 102)',
            'secondary-darken-2': 'rgb(53, 49, 76)',

            // Accent colors
            'accent': 'rgb(191, 155, 108)', // Warm brown
            'info': 'rgb(79, 143, 186)', // Muted blue
            'success': 'rgb(95, 158, 124)', // Muted green
            'warning': 'rgb(204, 156, 73)', // Muted orange
            'error': 'rgb(181, 99, 99)', // Muted red

            // Background colors
            'background': 'rgb(250, 250, 248)', // Warm white
            'surface': 'rgb(255, 255, 255)', // Pure white for cards
            'surface-variant': 'rgb(235, 235, 235)', // Slightly off-white
            'surface-variant-light': 'rgb(245, 245, 245)', // Lighter variant for contrast
            'surface-variant-dark': 'rgb(220, 220, 220)', // Darker variant for contrast

            // Text colors
            'on-primary': 'rgb(255, 255, 255)', // White text on primary
            'on-secondary': 'rgb(255, 255, 255)', // White text on secondary
            'on-background': 'rgb(33, 37, 41)', // Dark text on background
            'on-surface': 'rgb(33, 37, 41)', // Dark text on surface
            'on-surface-variant': 'rgb(73, 80, 87)', // Medium text

            // Transparent variants (for CSS usage)
            'primary-transparent': 'rgb(106, 127, 83)',
            'secondary-transparent': 'rgb(89, 82, 127)',
          },
        },
        dark: {
          dark: true,
          colors: {
            // Primary colors - brighter sage for dark theme
            'primary': 'rgb(142, 160, 110)', // Lighter sage for dark theme
            'primary-lighten-1': 'rgb(168, 176, 140)',
            'primary-lighten-2': 'rgb(194, 201, 170)',
            'primary-darken-1': 'rgb(118, 133, 91)',
            'primary-darken-2': 'rgb(94, 106, 73)',

            // Secondary colors - brighter purple for dark theme
            'secondary': 'rgb(126, 118, 164)', // Lighter purple for dark theme
            'secondary-lighten-1': 'rgb(151, 144, 184)',
            'secondary-lighten-2': 'rgb(176, 170, 204)',
            'secondary-darken-1': 'rgb(101, 94, 131)',
            'secondary-darken-2': 'rgb(76, 71, 98)',

            // Accent colors - adjusted for dark theme
            'accent': 'rgb(215, 179, 132)', // Lighter warm brown
            'info': 'rgb(103, 167, 210)', // Brighter blue
            'success': 'rgb(119, 182, 148)', // Brighter green
            'warning': 'rgb(228, 180, 97)', // Brighter orange
            'error': 'rgb(205, 123, 123)', // Brighter red

            // Background colors for dark theme
            'background': 'rgb(18, 20, 22)', // Very dark background
            'surface': 'rgb(28, 32, 36)', // Dark surface for cards
            'surface-variant': 'rgb(38, 42, 46)', // Slightly lighter surface
            'surface-variant-light': 'rgb(48, 52, 56)', // Lighter variant for contrast
            'surface-variant-dark': 'rgb(24, 28, 32)', // Darker variant for contrast

            // Text colors for dark theme
            'on-primary': 'rgb(255, 255, 255)', // White text on primary
            'on-secondary': 'rgb(255, 255, 255)', // White text on secondary
            'on-background': 'rgb(230, 230, 230)', // Light text on dark background
            'on-surface': 'rgb(230, 230, 230)', // Light text on dark surface
            'on-surface-variant': 'rgb(180, 180, 180)', // Medium light text

            // Transparent variants (for CSS usage)
            'primary-transparent': 'rgb(142, 160, 110)',
            'secondary-transparent': 'rgb(126, 118, 164)',
          },
        },
      },
    },
    defaults: {
      VTextarea: {
        variant: 'outlined',
      },
      VTextField: {
        variant: 'outlined',
      },
      VAutocomplete: {
        variant: 'outlined',
      },
      VSelect: {
        variant: 'outlined',
      },
      VBtn: {
        variant: 'outlined',
        rounded: 'lg',
      },
      VContainer: {
        style: 'max-width: 1400px',
      },
      VCard: {
        rounded: 'xl',
        width: '100%',
      },
      VTab: {
        rounded: 'xl',
      },
      VListItem: {
        rounded: 'lg',
      },
    },
    display: {
      mobileBreakpoint: 'sm',
    },
  })
  app.vueApp.use(vuetify)
})
