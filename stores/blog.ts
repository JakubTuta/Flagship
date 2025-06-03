import { collection, getDocs, query, where } from 'firebase/firestore'
import type { IBlog } from '~/models/blog'
import { mapIBlog } from '~/models/blog'
import type { IUser } from '~/models/user'

export const useBlogStore = defineStore('blog', () => {
  const blogs = ref<IBlog[]>([])
  const loading = ref(false)

  const { firestore } = useFirebase()
  const blogsCollection = collection(firestore, 'blogs')

  const fetchBlogs = async (user: IUser) => {
    if (!user.reference) {
      console.warn('User reference is not available, cannot fetch blogs.')

      return
    }

    loading.value = true

    try {
      const response = await getDocs(query(blogsCollection, where('author', '==', user.reference)))
      blogs.value = response.docs.map(doc => mapIBlog(doc.data(), doc.ref))
    }
    catch (error) {
      console.error('Error fetching blogs:', error)
    }
    finally {
      loading.value = false
    }
  }

  return {
    blogs,
    loading,
    fetchBlogs,
  }
})
