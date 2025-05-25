export const useDrawerStore = defineStore('drawer', () => {
  // State
  const isOpen = ref(true)

  // Actions
  const toggleDrawer = () => {
    isOpen.value = !isOpen.value
  }

  const openDrawer = () => {
    isOpen.value = true
  }

  const closeDrawer = () => {
    isOpen.value = false
  }

  return {
    // State
    isOpen,
    // Actions
    toggleDrawer,
    openDrawer,
    closeDrawer,
  }
})
