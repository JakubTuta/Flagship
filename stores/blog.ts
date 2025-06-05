import type { DocumentReference } from 'firebase/firestore'
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import type { IBlog } from '~/models/blog'
import { mapIBlogDecoded } from '~/models/blog'
import type { IUser } from '~/models/user'

export const useBlogStore = defineStore('blog', () => {
  const publishedBlogs = ref<IBlog[]>([])
  const blogs = ref<IBlog[]>([])
  const workingBlogs = ref<IWorkingBlog[]>([])
  const loading = ref(false)

  const { firestore } = useFirebase()
  const blogsCollection = collection(firestore, 'blogs')
  const workingBlogsCollection = collection(firestore, 'workingBlogs')

  const resetState = () => {
    publishedBlogs.value = []
    blogs.value = []
    workingBlogs.value = []
    loading.value = false
  }

  const fetchBlogs = async (user: IUser) => {
    loading.value = true

    try {
      const response = await getDocs(query(blogsCollection, where('author', '==', user.reference)))
      blogs.value = response.docs.map(doc => mapIBlogDecoded(doc.data(), doc.ref))
    }
    catch (error) {
      console.error('Error fetching blogs:', error)
    }
    finally {
      loading.value = false
    }
  }

  const fetchPublishedBlogs = async () => {
    loading.value = true

    try {
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

  const fetchWorkingBlogs = async (user: IUser) => {
    loading.value = true

    try {
      const response = await getDocs(query(workingBlogsCollection, where('author', '==', user.reference)))
      workingBlogs.value = response.docs.map(doc => mapIWorkingBlogDecoded(doc.data(), doc.ref))
    }
    catch (error) {
      console.error('Error fetching working blogs:', error)
    }
    finally {
      loading.value = false
    }
  }

  async function getBlog(userData: IUser | null, blogId: string | null) {
    if (!blogId) {
      console.error('Blog ID is missing.')

      return null
    }

    const foundBlog = blogs.value.find(blog => blog.reference?.id === blogId)
    if (foundBlog) {
      if (userData || foundBlog.isPublished)
        return foundBlog

      return null
    }

    try {
      loading.value = true

      const documentRef = doc(blogsCollection, blogId)
      const document = await getDoc(documentRef)
      if (!document.exists()) {
        console.warn(`Blog with id ${blogId} not found.`)

        return null
      }

      const blog = mapIBlogDecoded(document.data(), document.ref)

      if (userData || blog.isPublished) {
        blogs.value.push(blog)

        return blog
      }

      return null
    }
    catch (error) {
      console.error('Error fetching blog by ID:', error)

      return null
    }
    finally {
      loading.value = false
    }
  }

  async function deleteBlog(userData: IUser | null, blog: IBlog | null) {
    if (!blog || !userData) {
      console.error('Blog or user data is missing.')

      return
    }

    if (!userData || userData.reference?.id !== blog.author?.id) {
      console.error('User is not authorized to delete this blog.')

      return
    }

    try {
      loading.value = true

      await deleteDoc(blog.reference!)
      blogs.value = blogs.value.filter(item => item.reference?.id !== blog.reference!.id)
    }
    catch (error) {
      console.error('Error deleting blog:', error)
    }
    finally {
      loading.value = false
    }
  }

  async function getWorkingBlog(userData: IUser | null, blogId: string | null) {
    if (!blogId || !userData) {
      console.error('Blog ID or user data is missing.')

      return null
    }

    const foundBlog = workingBlogs.value.find(blog => blog.reference?.id === blogId)
    if (foundBlog) {
      return foundBlog
    }

    try {
      loading.value = true

      const documentRef = doc(workingBlogsCollection, blogId)
      const document = await getDoc(documentRef)
      if (!document.exists()) {
        console.warn(`Working blog with id ${blogId} not found.`)

        return null
      }

      const blog = mapIWorkingBlogDecoded(document.data(), document.ref)

      workingBlogs.value.push(blog)

      return blog
    }
    catch (error) {
      console.error('Error fetching working blog by ID:', error)

      return null
    }
    finally {
      loading.value = false
    }
  }

  const createBlog = async (blog: IBlog) => {
    loading.value = true

    try {
      const docRef = doc(blogsCollection, blog.value)
      await setDoc(docRef, removeReferenceField(blog))

      blog.reference = docRef
      blogs.value.push(blog)

      return blog
    }
    catch (error) {
      console.error('Error creating blog:', error)
    }
    finally {
      loading.value = false
    }
  }

  const updateBlog = async (blogRef: DocumentReference | null, blog: IBlog) => {
    if (!blogRef) {
      console.error('No reference provided for the blog to update.')

      return null
    }

    loading.value = true
    try {
      await updateDoc(blogRef, removeReferenceField(blog) as any)
      const foundBlog = blogs.value.find(b => b.reference?.id === blogRef.id)
      if (foundBlog) {
        Object.assign(foundBlog, blog)
      }
      else {
        blog.reference = blogRef
        blogs.value.push(blog)
      }

      return blog
    }
    catch (error) {
      console.error('Error updating blog:', error)
    }
    finally {
      loading.value = false
    }
  }

  const saveWorkingBlog = async (blog: IWorkingBlog) => {
    try {
      if (blog.reference) {
        await updateDoc(blog.reference, removeReferenceField(blog) as any)
      }
      else {
        const docRef = doc(workingBlogsCollection, blog.value)
        await setDoc(docRef, removeReferenceField(blog))
        blog.reference = docRef
      }
    }
    catch (error) {
      console.error('Error saving working blog:', error)
    }
  }

  const deleteWorkingBlog = async (userData: IUser | null, blog: IWorkingBlog) => {
    if (!blog.reference) {
      console.error('No reference found for the working blog to delete.')

      return
    }

    if (!userData || userData.reference?.id !== blog.author?.id) {
      console.error('User is not authorized to delete this working blog.')

      return
    }

    try {
      await deleteDoc(blog.reference)
      const index = workingBlogs.value.findIndex(b => b.reference?.id === blog.reference!.id)
      if (index !== -1) {
        workingBlogs.value.splice(index, 1)
      }
    }
    catch (error) {
      console.error('Error deleting working blog:', error)
    }
  }

  return {
    publishedBlogs,
    blogs,
    workingBlogs,
    loading,
    resetState,
    fetchBlogs,
    fetchPublishedBlogs,
    fetchWorkingBlogs,
    getBlog,
    deleteBlog,
    getWorkingBlog,
    createBlog,
    updateBlog,
    saveWorkingBlog,
    deleteWorkingBlog,
  }
})
