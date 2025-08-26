import { deleteObject, getDownloadURL, getMetadata, listAll, ref as storageRef, uploadBytes } from 'firebase/storage'

export interface IFileItem {
  name: string
  size: number
  timeCreated: string
  downloadURL: string
  fullPath: string
}

export const useFilesStore = defineStore('files', () => {
  // State
  const files = ref<IFileItem[]>([])
  const selectedFiles = ref<File[]>([])
  const uploading = ref(false)
  const loadingFiles = ref(false)
  const deleting = ref(false)
  const uploadProgress = ref(0)

  // Composables
  const { storage, auth } = useFirebase()

  // Getters
  const sortedFiles = computed(() => {
    return files.value?.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime()) || []
  })

  const hasFiles = computed(() => (files.value?.length || 0) > 0)

  const canUpload = computed(() => {
    return (selectedFiles.value?.length || 0) > 0 && !uploading.value
  })

  // Actions
  const getUserStoragePath = (): string => {
    if (!auth) {
      throw new Error('Auth not available')
    }

    const user = auth.currentUser
    if (!user) {
      throw new Error('User not authenticated')
    }

    return `users/${user.uid}/files`
  }

  const setSelectedFiles = (newFiles: File[]): void => {
    selectedFiles.value = newFiles
  }

  const loadFiles = async (): Promise<{ success: boolean, message?: string }> => {
    // Skip on server side or if storage is not available
    if (!storage || import.meta.server) {
      return { success: false, message: 'Storage not available' }
    }

    loadingFiles.value = true

    try {
      const userPath = getUserStoragePath()
      const listRef = storageRef(storage, userPath)
      const result = await listAll(listRef)

      const filePromises = result.items.map(async (item) => {
        const metadata = await getMetadata(item)
        const downloadURL = await getDownloadURL(item)

        return {
          name: item.name,
          size: metadata.size,
          timeCreated: metadata.timeCreated,
          downloadURL,
          fullPath: item.fullPath,
        }
      })

      files.value = await Promise.all(filePromises)

      return { success: true }
    }
    catch (error) {
      console.error('Load files error:', error)

      return {
        success: false,
        message: useNuxtApp().$i18n.t('files.list.error'),
      }
    }
    finally {
      loadingFiles.value = false
    }
  }

  const uploadFiles = async (): Promise<{ success: boolean, message: string }> => {
    if (!selectedFiles.value || selectedFiles.value.length === 0) {
      return { success: false, message: 'No files selected' }
    }

    // Skip on server side or if storage is not available
    if (!storage || import.meta.server) {
      return { success: false, message: 'Storage not available' }
    }

    uploading.value = true
    uploadProgress.value = 0

    try {
      const userPath = getUserStoragePath()
      const totalFiles = selectedFiles.value.length

      const uploadPromises = selectedFiles.value.map(async (file, index) => {
        const fileName = `${Date.now()}_${file.name}`
        const fileRef = storageRef(storage, `${userPath}/${fileName}`)
        await uploadBytes(fileRef, file)
        uploadProgress.value = ((index + 1) / totalFiles) * 100
      })

      await Promise.all(uploadPromises)

      selectedFiles.value = []
      // Reload files after upload
      const loadResult = await loadFiles()
      if (!loadResult.success && loadResult.message) {
        console.warn('Failed to reload files after upload:', loadResult.message)
      }

      return {
        success: true,
        message: useNuxtApp().$i18n.t('files.upload.success'),
      }
    }
    catch (error) {
      console.error('Upload error:', error)

      return {
        success: false,
        message: useNuxtApp().$i18n.t('files.upload.error'),
      }
    }
    finally {
      uploading.value = false
      uploadProgress.value = 0
    }
  }

  const downloadFile = (file: IFileItem): { success: boolean, message: string } => {
    try {
      const link = document.createElement('a')
      link.href = file.downloadURL
      link.download = file.name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return {
        success: true,
        message: useNuxtApp().$i18n.t('files.download.success'),
      }
    }
    catch (error) {
      console.error('Download error:', error)

      return {
        success: false,
        message: useNuxtApp().$i18n.t('files.download.error'),
      }
    }
  }

  const deleteFile = async (file: IFileItem): Promise<{ success: boolean, message: string }> => {
    // Skip on server side or if storage is not available
    if (!storage || import.meta.server) {
      return { success: false, message: 'Storage not available' }
    }

    deleting.value = true

    try {
      const fileRef = storageRef(storage, file.fullPath)
      await deleteObject(fileRef)

      // Remove from local state
      files.value = files.value.filter(f => f.fullPath !== file.fullPath)

      return {
        success: true,
        message: useNuxtApp().$i18n.t('files.delete.success'),
      }
    }
    catch (error) {
      console.error('Delete error:', error)

      return {
        success: false,
        message: useNuxtApp().$i18n.t('files.delete.error'),
      }
    }
    finally {
      deleting.value = false
    }
  }

  const getFileIcon = (fileName: string): { icon: string, color: string } => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    const iconMap: Record<string, { icon: string, color: string }> = {
      pdf: { icon: 'mdi-file-pdf-box', color: 'red' },
      doc: { icon: 'mdi-file-word-box', color: 'blue' },
      docx: { icon: 'mdi-file-word-box', color: 'blue' },
      xls: { icon: 'mdi-file-excel-box', color: 'green' },
      xlsx: { icon: 'mdi-file-excel-box', color: 'green' },
      ppt: { icon: 'mdi-file-powerpoint-box', color: 'orange' },
      pptx: { icon: 'mdi-file-powerpoint-box', color: 'orange' },
      txt: { icon: 'mdi-file-document-outline', color: 'grey' },
      jpg: { icon: 'mdi-file-image', color: 'purple' },
      jpeg: { icon: 'mdi-file-image', color: 'purple' },
      png: { icon: 'mdi-file-image', color: 'purple' },
      gif: { icon: 'mdi-file-image', color: 'purple' },
      mp4: { icon: 'mdi-file-video', color: 'red' },
      mp3: { icon: 'mdi-file-music', color: 'orange' },
      zip: { icon: 'mdi-folder-zip', color: 'yellow' },
      rar: { icon: 'mdi-folder-zip', color: 'yellow' },
    }

    return iconMap[extension || ''] || { icon: 'mdi-file-outline', color: 'grey' }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0)
      return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString()
  }

  const resetState = (): void => {
    files.value = []
    selectedFiles.value = []
    uploading.value = false
    loadingFiles.value = false
    deleting.value = false
    uploadProgress.value = 0
  }

  return {
    // State
    files,
    selectedFiles,
    uploading,
    loadingFiles,
    deleting,
    uploadProgress,

    // Getters
    sortedFiles,
    hasFiles,
    canUpload,

    // Actions
    setSelectedFiles,
    uploadFiles,
    loadFiles,
    downloadFile,
    deleteFile,
    getFileIcon,
    formatFileSize,
    formatDate,
    resetState,
  }
})
