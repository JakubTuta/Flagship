import { collection, getDocs, increment, query, updateDoc, where } from 'firebase/firestore'
import type { IBlog } from '~/models/blog'
import { mapIBlogDecoded } from '~/models/blog'
import type { IBlogSerialized } from '~/models/serialized'

export const useBlogStore = defineStore('blog', () => {
  const publishedBlogs = ref<IBlog[]>([])
  const loading = ref(false)

  const resetState = () => {
    publishedBlogs.value = []
    loading.value = false
  }

  const fetchPublishedBlogs = async () => {
    const { firestore } = useFirebase()

    if (!firestore || import.meta.server) {
      return
    }

    loading.value = true

    try {
      const blogsCollection = collection(firestore, 'blogs')
      const response = await getDocs(query(blogsCollection, where('isPublished', '==', true)))
      publishedBlogs.value = response.docs.map(doc => mapIBlogDecoded(doc.data(), doc.ref))
    }
    catch (error) {
      console.error('Error fetching published blogs:', error)
    }
    finally {
      loading.value = false
    }
  }

  const addView = (blog: IBlog) => {
    try {
      updateDoc(blog.reference!, {
        viewCount: increment(1),
      })
    }
    catch (error) {
      console.error('Error adding view to blog:', error)
    }
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
    fetchPublishedBlogs,
    addView,
    hydratePublishedBlogs,
  }
})
