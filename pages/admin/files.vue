<script setup lang="ts">
import type { IFileItem } from '~/stores/files'

definePageMeta({
  middleware: ['auth'],
})

// Store
const filesStore = useFilesStore()
const {
  selectedFiles,
  uploading,
  loadingFiles,
  deleting,
  uploadProgress,
  sortedFiles,
  hasFiles,
} = storeToRefs(filesStore)

// Local state for UI
const deleteDialog = ref(false)
const fileToDelete = ref<IFileItem | null>(null)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

// Methods
async function onFileSelect(files: File | File[]) {
  const fileArray = Array.isArray(files)
    ? files
    : [files]

  if (fileArray.length > 0) {
    filesStore.setSelectedFiles(fileArray)
    // Automatically upload the selected files
    await handleUpload()
  }
}

function showSnackbar(message: string, color: string) {
  snackbar.value = {
    show: true,
    message,
    color,
  }
}

async function handleUpload() {
  const result = await filesStore.uploadFiles()
  showSnackbar(result.message, result.success
    ? 'success'
    : 'error')
}

async function handleLoadFiles() {
  const result = await filesStore.loadFiles()
  if (!result.success && result.message) {
    showSnackbar(result.message, 'error')
  }
}

function handleDownload(file: IFileItem) {
  const result = filesStore.downloadFile(file)
  showSnackbar(result.message, result.success
    ? 'success'
    : 'error')
}

function showDeleteDialog(file: IFileItem) {
  fileToDelete.value = file
  deleteDialog.value = true
}

async function handleConfirmDelete() {
  if (!fileToDelete.value)
    return

  const result = await filesStore.deleteFile(fileToDelete.value)
  showSnackbar(result.message, result.success
    ? 'success'
    : 'error')

  deleteDialog.value = false
  fileToDelete.value = null
}

// Load files on mount
onMounted(() => {
  handleLoadFiles()
})
</script>

<template>
  <v-container
    class="pa-6"
    style="max-width: 1000px;"
  >
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">
        {{ $t('files.title') }}
      </h1>
    </div>

    <v-row>
      <!-- File Upload Section -->
      <v-col cols="12">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-h6 mb-4">
            {{ $t('files.upload.title') }}
          </v-card-title>

          <v-file-input
            :model-value="selectedFiles"
            :label="$t('files.upload.selectFiles')"

            chips
            show-size
            multiple
            prepend-icon="mdi-cloud-upload"
            :loading="uploading"
            :disabled="uploading"
            @update:model-value="onFileSelect"
          />

          <v-progress-linear
            v-if="uploading"
            :model-value="uploadProgress"
            class="mt-4"
            color="primary"
            height="6"
          />
        </v-card>
      </v-col>

      <!-- Files List Section -->
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title class="text-h6 d-flex justify-space-between align-center mb-4">
            {{ $t('files.list.title') }}
            <v-btn
              icon
              size="small"
              :loading="loadingFiles"
              @click="handleLoadFiles"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>

          <v-list
            v-if="hasFiles"
            class="pa-0"
          >
            <v-list-item
              v-for="file in sortedFiles"
              :key="file.name"
              class="px-0"
            >
              <template #prepend>
                <v-icon :color="filesStore.getFileIcon(file.name).color">
                  {{ filesStore.getFileIcon(file.name).icon }}
                </v-icon>
              </template>

              <v-list-item-title>{{ file.name }}</v-list-item-title>

              <v-list-item-subtitle>
                {{ filesStore.formatFileSize(file.size) }} • {{ filesStore.formatDate(file.timeCreated) }}
              </v-list-item-subtitle>

              <template #append>
                <div class="d-flex gap-2">
                  <v-btn
                    icon
                    size="small"
                    color="primary"
                    @click="handleDownload(file)"
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>

                  <v-btn
                    icon
                    size="small"
                    color="error"
                    @click="showDeleteDialog(file)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>

          <v-empty-state
            v-else-if="!loadingFiles"
            :headline="$t('files.list.empty.title')"
            :title="$t('files.list.empty.subtitle')"
            icon="mdi-file-outline"
          />

          <v-progress-circular
            v-if="loadingFiles"
            indeterminate
            color="primary"
            class="d-block mx-auto"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Confirmation Dialog -->
    <v-dialog
      v-model="deleteDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title>{{ $t('files.delete.title') }}</v-card-title>

        <v-card-text>
          {{ $t('files.delete.message', {"fileName": fileToDelete?.name}) }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="grey"
            @click="deleteDialog = false"
          >
            {{ $t('common.cancel') }}
          </v-btn>

          <v-btn
            color="error"
            :loading="deleting"
            @click="handleConfirmDelete"
          >
            {{ $t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
