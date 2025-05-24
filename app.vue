<script setup lang="ts">
import { useDisplay } from 'vuetify'

const languageStore = useLanguageStore()
const drawerStore = useDrawerStore()

const { mobile } = useDisplay()

onMounted(() => {
  const storageLang = localStorage.getItem('lang')

  if (storageLang) {
    // @ts-expect-error type
    languageStore.setLanguage(storageLang)
  }
  else {
    languageStore.setLanguage('en')
  }
})
</script>

<template>
  <NuxtLayout>
    <v-app>
      <v-btn
        v-if="mobile"
        icon="mdi-menu"
        rounded="circle"
        class="mobile-menu-btn floating-btn"
        elevation="15"
        @click="drawerStore.toggleDrawer()"
      />

      <v-main>
        <NuxtPage />

        <NavigationDrawer
          :mobile="mobile"
        />
      </v-main>
    </v-app>

    <Footer />
  </NuxtLayout>
</template>

<style scoped>
.mobile-menu-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

.floating-btn {
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
