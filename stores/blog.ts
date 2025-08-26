import type { DocumentReference } from 'firebase/firestore'
import { addDoc, collection, deleteDoc, doc, getDocs, increment, query, setDoc, updateDoc, where } from 'firebase/firestore'
import type { IBlog } from '~/models/blog'
import { mapIBlogDecoded } from '~/models/blog'
import type { IUser } from '~/models/user'
import type { IWorkingBlog } from '~/models/workingBlog'
import { mapIWorkingBlogDecoded } from '~/models/workingBlog'

export const useBlogStore = defineStore('blog', () => {
  const publishedBlogs = ref<IBlog[]>([])
  const blogs = ref<IBlog[]>([])
  const workingBlogs = ref<IWorkingBlog[]>([])
  const loading = ref(false)

  const { firestore, storage } = useFirebase()

  const resetState = () => {
    publishedBlogs.value = []
    blogs.value = []
    workingBlogs.value = []
    loading.value = false
  }

  const fetchBlogs = async (user: IUser) => {
    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return
    }

    loading.value = true

    try {
      const blogsCollection = collection(firestore, 'blogs')
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
    // Skip on server side or if firestore is not available
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

  const fetchWorkingBlogs = async (user: IUser) => {
    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return
    }

    loading.value = true

    try {
      const workingBlogsCollection = collection(firestore, 'workingBlogs')
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

    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
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

      const blogsCollection = collection(firestore, 'blogs')
      const q = query(blogsCollection, where('value', '==', blogId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.warn(`Blog with id ${blogId} not found.`)

        return null
      }

      const document = querySnapshot.docs[0]
      const blog = mapIBlogDecoded(document.data() as any, document.ref)

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

  async function getBlogUser(blogId: string | null) {
    if (!blogId) {
      console.error('Blog ID is missing.')

      return null
    }

    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return null
    }

    const foundBlog = publishedBlogs.value.find(blog => blog.reference?.id === blogId)
    if (foundBlog) {
      return foundBlog
    }

    try {
      loading.value = true

      const blogsCollection = collection(firestore, 'blogs')
      const q = query(blogsCollection, where('value', '==', blogId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.warn(`Blog with id ${blogId} not found.`)

        return null
      }

      const document = querySnapshot.docs[0]
      const blog = mapIBlogDecoded(document.data() as any, document.ref)

      if (blog.isPublished)
        return blog
    }
    catch (error) {
      console.error('Error fetching blog user by ID:', error)

      return null
    }
    finally {
      loading.value = false
    }

    return null
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

    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return null
    }

    const foundBlog = workingBlogs.value.find(blog => blog.reference?.id === blogId)
    if (foundBlog) {
      return foundBlog
    }

    try {
      loading.value = true

      const workingBlogsCollection = collection(firestore, 'workingBlogs')
      const q = query(workingBlogsCollection, where('value', '==', blogId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.warn(`Working blog with id ${blogId} not found.`)

        return null
      }

      const document = querySnapshot.docs[0]
      const blog = mapIWorkingBlogDecoded(document.data() as any, document.ref)

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
    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return null
    }

    loading.value = true

    try {
      const blogsCollection = collection(firestore, 'blogs')
      const docRef = await addDoc(blogsCollection, removeReferenceField(blog))
      blog.reference = docRef

      const decodedBlog = mapIBlogDecoded(blog, docRef)
      blogs.value.push(decodedBlog)
      if (blog.isPublished) {
        publishedBlogs.value.push(decodedBlog)
      }

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

      const decodedBlog = mapIBlogDecoded(blog, blogRef)
      if (foundBlog) {
        Object.assign(foundBlog, decodedBlog)
      }
      else {
        decodedBlog.reference = blogRef
        blogs.value.push(decodedBlog)
      }

      return decodedBlog
    }
    catch (error) {
      console.error('Error updating blog:', error)
    }
    finally {
      loading.value = false
    }
  }

  const saveWorkingBlog = async (blog: IWorkingBlog) => {
    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return
    }

    try {
      if (blog.reference) {
        await updateDoc(blog.reference, removeReferenceField(blog) as any)
      }
      else {
        const workingBlogsCollection = collection(firestore, 'workingBlogs')
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

  const addImage = (image: string) => {
    // Skip on server side or if storage is not available
    if (!storage || import.meta.server) {
      return null
    }

    const imageUrl = createAndUploadImage('blogs', image, storage)

    return imageUrl
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
    getBlogUser,
    deleteBlog,
    getWorkingBlog,
    createBlog,
    updateBlog,
    saveWorkingBlog,
    deleteWorkingBlog,
    addImage,
    addView,
  }
})
