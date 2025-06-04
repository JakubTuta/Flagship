<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const selectedTab = ref('published')

const { t, locale } = useI18n()

const authStore = useAuthStore()
const { userData } = storeToRefs(authStore)

const blogStore = useBlogStore()
const { blogs, workingBlogs, loading } = storeToRefs(blogStore)

const tabs = computed(() => [
  { title: t('admin.blog.published'), value: 'published' },
  { title: t('admin.blog.notPublished'), value: 'not-published' },
  { title: t('admin.blog.drafts'), value: 'drafts' },
])

watch(userData, (newUser) => {
  if (newUser && !blogs.value.length)
    blogStore.fetchBlogs(newUser)

  if (newUser && !workingBlogs.value.length)
    blogStore.fetchWorkingBlogs(newUser)
}, { immediate: true })

const blogTab = computed(() => {
  switch (selectedTab.value) {
    case 'published':
      return blogs.value.filter(blog => blog.isPublished)
    case 'not-published':
      return blogs.value.filter(blog => !blog.isPublished)
    case 'drafts':
      return workingBlogs.value
    default:
      return []
  }
})
</script>

<template>
  <v-container>
    <v-card :loading="loading">
      <v-card-title class="pa-6">
        <v-row>
          <v-btn
            append-icon="mdi-plus"
            color="primary"
            to="/admin/blog/write"
            rounded="xl"
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
            v-for="blog in blogTab"
            :key="blog.reference!.id"
            cols="6"
            sm="4"
            md="3"
          >
            <v-card
              class="d-flex align-center justify-center"
              min-height="100"
              variant="elevated"
              :to="`/admin/blog/write?blogId=${blog.reference!.id}`"
            >
              <v-card-title>
                {{ typeof blog.title === 'string'
                  ? blog.title
                  : blog.title[locale] }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
