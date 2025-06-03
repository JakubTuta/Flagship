<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const selectedTab = ref('published')

const { t } = useI18n()

const authStore = useAuthStore()
const { userData } = storeToRefs(authStore)

const blogStore = useBlogStore()
const { blogs, loading } = storeToRefs(blogStore)

const tabs = computed(() => [
  { title: t('admin.blog.published'), value: 'published' },
  { title: t('admin.blog.drafts'), value: 'drafts' },
])

watch(userData, (newUser) => {
  if (newUser && !blogs.value.length)
    blogStore.fetchBlogs(newUser)
}, { immediate: true })
</script>

<template>
  <v-container>
    <v-card :loading="loading">
      <v-card-title class="pa-6">
        <v-row>
          <v-btn
            append-icon="mdi-plus"
            color="primary"
            to="/admin/blog/create"
          >
            Create New Post
          </v-btn>
        </v-row>

        <v-row class="mt-8">
          <v-tabs
            v-model="selectedTab"
            color="primary"
          >
            <v-tab
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
            >
              {{ tab.title }}
            </v-tab>
          </v-tabs>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col
            v-for="blog in blogs"
            :key="blog.id"
            cols="6"
            sm="4"
            md="3"
          >
            {{ blog }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
