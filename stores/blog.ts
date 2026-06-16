import type { IBlog } from '~/models/blog'
import type { IBlogSerialized } from '~/models/serialized'

export const useBlogStore = defineStore('blog', () => {
  const publishedBlogs = ref<IBlog[]>([])
  const loading = ref(false)

  const resetState = () => {
    publishedBlogs.value = []
    loading.value = false
  }

  function hydratePublishedBlogs(serializedBlogs: IBlogSerialized[]) {
    if (publishedBlogs.value.length > 0) {
      return
    }

    publishedBlogs.value = serializedBlogs.map(blog => ({
      title: blog.title,
      value: blog.value,
      content: blog.content,
      featured: blog.featured,
      links: blog.links,
      projects: [],
      image: blog.image,
      isPublished: blog.isPublished,
      publishDate: blog.publishDate
        ? new Date(blog.publishDate)
        : null,
      author: null,
      tableOfContents: blog.tableOfContents,
      category: blog.category,
      viewCount: blog.viewCount,
      mainLanguage: blog.mainLanguage,
      reference: null,
    }))
  }

  return {
    publishedBlogs,
    loading,
    resetState,
    hydratePublishedBlogs,
  }
})
