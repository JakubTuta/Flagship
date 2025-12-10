<script setup lang="ts">
import { type IProject, mapIProject } from '~/models/project'

definePageMeta({ middleware: ['auth'] })

const { storage } = useFirebase()
const router = useRouter()

const formValid = ref(false)
const loading = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const project = ref<IProject>(mapIProject({}))

const categories = [
  'Web Development',
  'Mobile Development',
  'Desktop Application',
  'Library/Package',
  'Tool/Utility',
  'API/Backend',
  'Full Stack',
  'Other',
]

const rules = {
  required: (v: string) => !!v || 'Field is required',
  maxLength100: (v: string) => !v || v.length <= 100 || 'Maximum 100 characters',
  maxLength300: (v: string) => !v || v.length <= 300 || 'Maximum 300 characters',
  url: (v: string) => {
    if (!v)
      return true
    const pattern = /^https?:\/\/.+/

    return pattern.test(v) || 'Must be a valid URL'
  },
}

const newTechnology = ref('')
const newLearnedEn = ref('')
const newLearnedPl = ref('')

const jsonInput = ref('')
const jsonError = ref('')
const jsonSuccess = ref(false)

function validateAndImportJson() {
  jsonError.value = ''
  jsonSuccess.value = false

  if (!jsonInput.value.trim()) {
    jsonError.value = 'Please paste JSON data'

    return
  }

  try {
    const data = JSON.parse(jsonInput.value)

    if (data.title)
      project.value.title = data.title
    if (data.value)
      project.value.value = data.value

    if (data.shortDescription && typeof data.shortDescription === 'object') {
      project.value.shortDescription.en = data.shortDescription.en || ''
      project.value.shortDescription.pl = data.shortDescription.pl || ''
    }

    if (data.description && typeof data.description === 'object') {
      project.value.description.en = data.description.en || ''
      project.value.description.pl = data.description.pl || ''
    }

    if (data.url)
      project.value.url = data.url
    if (data.demoUrl !== undefined)
      project.value.demoUrl = data.demoUrl
    if (data.category)
      project.value.category = data.category
    if (typeof data.featured === 'boolean')
      project.value.featured = data.featured

    if (Array.isArray(data.technologies)) {
      project.value.technologies = data.technologies.slice(0, 10)
    }

    if (Array.isArray(data.learned)) {
      project.value.learned = data.learned.slice(0, 10).map((item: any) => ({
        en: item.en || '',
        pl: item.pl || '',
      }))
    }

    if (data.image)
      project.value.image = data.image

    jsonSuccess.value = true
    setTimeout(() => {
      jsonSuccess.value = false
    }, 3000)
  }
  catch (error) {
    jsonError.value = `Invalid JSON format: ${error instanceof Error
      ? error.message
      : 'Unknown error'}`
  }
}

function addTechnology() {
  if (newTechnology.value.trim() && project.value.technologies.length < 10) {
    project.value.technologies.push(newTechnology.value.trim())
    newTechnology.value = ''
  }
}

function removeTechnology(index: number) {
  project.value.technologies.splice(index, 1)
}

function addLearned() {
  if (
    (newLearnedEn.value.trim() || newLearnedPl.value.trim())
    && project.value.learned.length < 10
  ) {
    project.value.learned.push({
      en: newLearnedEn.value.trim(),
      pl: newLearnedPl.value.trim(),
    })
    newLearnedEn.value = ''
    newLearnedPl.value = ''
  }
}

function removeLearned(index: number) {
  project.value.learned.splice(index, 1)
}

function handleImageSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    imageFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function uploadImage(): Promise<string | null> {
  if (!imageFile.value || !storage)
    return null

  try {
    const { ref: storageRef, uploadBytes, getDownloadURL } = await import('firebase/storage')
    const timestamp = Date.now()
    const fileName = `projects/${timestamp}_${imageFile.value.name}`
    const fileRef = storageRef(storage, fileName)

    await uploadBytes(fileRef, imageFile.value)
    const downloadURL = await getDownloadURL(fileRef)

    return downloadURL
  }
  catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

async function saveProject() {
  if (!formValid.value)
    return

  loading.value = true

  try {
    const { firestore } = useFirebase()
    if (!firestore)
      throw new Error('Firestore not initialized')

    let imageUrl = project.value.image

    if (imageFile.value) {
      imageUrl = await uploadImage()
    }

    const { collection, addDoc } = await import('firebase/firestore')

    const projectData = {
      ...project.value,
      image: imageUrl,
    }

    await addDoc(collection(firestore, 'projects'), projectData)

    router.push('/projects')
  }
  catch (error) {
    console.error('Error saving project:', error)
    // eslint-disable-next-line no-alert
    alert('Failed to save project. Please try again.')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
      >
        <v-card>
          <v-card-title class="text-h4 pa-6">
            Create New Project
          </v-card-title>

          <v-card-text>
            <v-expansion-panels class="mb-6">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">
                      mdi-code-json
                    </v-icon>
                    Import from JSON
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-textarea
                    v-model="jsonInput"
                    label="Paste JSON data here"
                    variant="outlined"
                    rows="8"
                    placeholder="{
  &quot;title&quot;: &quot;Project Name&quot;,
  &quot;value&quot;: &quot;project-name&quot;,
  &quot;shortDescription&quot;: { &quot;en&quot;: &quot;...&quot;, &quot;pl&quot;: &quot;...&quot; },
  &quot;description&quot;: { &quot;en&quot;: &quot;...&quot;, &quot;pl&quot;: &quot;...&quot; },
  &quot;url&quot;: &quot;https://github.com/...&quot;,
  &quot;demoUrl&quot;: &quot;https://...&quot;,
  &quot;featured&quot;: false,
  &quot;category&quot;: &quot;Web Development&quot;,
  &quot;technologies&quot;: [&quot;Vue&quot;, &quot;TypeScript&quot;],
  &quot;learned&quot;: [{ &quot;en&quot;: &quot;...&quot;, &quot;pl&quot;: &quot;...&quot; }],
  &quot;image&quot;: &quot;https://...&quot;
}"
                  />

                  <v-alert
                    v-if="jsonError"
                    type="error"
                    class="mt-2"
                    closable
                  >
                    {{ jsonError }}
                  </v-alert>

                  <v-alert
                    v-if="jsonSuccess"
                    type="success"
                    class="mt-2"
                  >
                    JSON imported successfully!
                  </v-alert>

                  <v-btn
                    color="primary"
                    class="mt-2"
                    block
                    @click="validateAndImportJson"
                  >
                    <v-icon class="mr-2">
                      mdi-import
                    </v-icon>
                    Import JSON
                  </v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-form v-model="formValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="project.title"
                    label="Project Title"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="project.value"
                    label="Project Value (unique identifier)"
                    :rules="[rules.required]"
                    variant="outlined"
                    hint="Lowercase, no spaces (e.g., 'my-awesome-project')"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-textarea
                    v-model="project.shortDescription.en"
                    label="Short Description (EN)"
                    :rules="[
                      rules.required,
                      rules.maxLength100,
                    ]"
                    variant="outlined"
                    rows="2"
                    counter="100"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-textarea
                    v-model="project.shortDescription.pl"
                    label="Short Description (PL)"
                    :rules="[
                      rules.required,
                      rules.maxLength100,
                    ]"
                    variant="outlined"
                    rows="2"
                    counter="100"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-textarea
                    v-model="project.description.en"
                    label="Description (EN)"
                    :rules="[
                      rules.required,
                      rules.maxLength300,
                    ]"
                    variant="outlined"
                    rows="4"
                    counter="300"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-textarea
                    v-model="project.description.pl"
                    label="Description (PL)"
                    :rules="[
                      rules.required,
                      rules.maxLength300,
                    ]"
                    variant="outlined"
                    rows="4"
                    counter="300"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="project.url"
                    label="Project URL (GitHub, etc.)"
                    :rules="[
                      rules.required,
                      rules.url,
                    ]"
                    variant="outlined"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="project.demoUrl"
                    label="Demo URL (optional)"
                    :rules="[rules.url]"
                    variant="outlined"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-select
                    v-model="project.category"
                    :items="categories"
                    label="Category"
                    :rules="[rules.required]"
                    variant="outlined"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-switch
                    v-model="project.featured"
                    label="Featured Project"
                    color="primary"
                  />
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-4" />

                  <div class="text-h6 mb-4">
                    Technologies (max 10)
                  </div>

                  <v-chip-group column>
                    <v-chip
                      v-for="(tech, index) in project.technologies"
                      :key="index"
                      closable
                      @click:close="removeTechnology(index)"
                    >
                      {{ tech }}
                    </v-chip>
                  </v-chip-group>

                  <v-row
                    v-if="project.technologies.length < 10"
                    class="mt-2"
                  >
                    <v-col cols="9">
                      <v-text-field
                        v-model="newTechnology"
                        label="Add technology"
                        variant="outlined"
                        density="compact"
                        @keyup.enter="addTechnology"
                      />
                    </v-col>

                    <v-col cols="3">
                      <v-btn
                        color="primary"
                        block
                        @click="addTechnology"
                      >
                        Add
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-4" />

                  <div class="text-h6 mb-4">
                    What I Learned (max 10)
                  </div>

                  <v-list>
                    <v-list-item
                      v-for="(item, index) in project.learned"
                      :key="index"
                    >
                      <template #prepend>
                        <v-icon
                          color="error"
                          @click="removeLearned(index)"
                        >
                          mdi-delete
                        </v-icon>
                      </template>

                      <v-list-item-title>EN: {{ item.en }}</v-list-item-title>

                      <v-list-item-subtitle>PL: {{ item.pl }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>

                  <v-row
                    v-if="project.learned.length < 10"
                    class="mt-2"
                  >
                    <v-col cols="12">
                      <v-text-field
                        v-model="newLearnedEn"
                        label="Learned (EN)"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="newLearnedPl"
                        label="Learned (PL)"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-btn
                        color="primary"
                        block
                        @click="addLearned"
                      >
                        Add Learning
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-4" />

                  <div class="text-h6 mb-4">
                    Project Image
                  </div>

                  <v-file-input
                    label="Upload project image"
                    accept="image/*"
                    variant="outlined"
                    prepend-icon="mdi-camera"
                    @change="handleImageSelect"
                  />

                  <v-img
                    v-if="imagePreview"
                    :src="imagePreview"
                    max-height="300"
                    class="mt-4"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-spacer />

            <v-btn
              variant="text"
              @click="router.push('/projects')"
            >
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              :disabled="!formValid"
              :loading="loading"
              @click="saveProject"
            >
              Create Project
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
