import type { User } from 'firebase/auth'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { removeReferenceField } from '~/helpers/modelToDatabase'
import type { IUser } from '~/models/user'
import { mapIUser } from '~/models/user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const userData = ref<IUser | null>(null)
  const loading = ref(false)

  const { auth, firestore } = useFirebase()
  const router = useRouter()

  const fetchUserData = async (user: User) => {
    loading.value = true

    try {
      const response = await getDoc(doc(firestore, 'users', user.uid))
      if (response.exists())
        userData.value = mapIUser(response.data(), response.ref)
      else
        userData.value = null
    }
    catch (error) {
      console.error('Error fetching user data:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  const createUserData = async (user: User, username: string) => {
    loading.value = true

    try {
      const userRef = doc(firestore, 'users', user.uid)
      const newUserData = mapIUser({
        email: user.email || '',
        username,
      })

      await setDoc(userRef, removeReferenceField(newUserData))

      userData.value = mapIUser(newUserData, userRef)
    }
    catch (error) {
      console.error('Error creating user data:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true

    try {
      await auth.signOut()
      user.value = null

      router.push('/')
    }
    catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      await fetchUserData(user.value)

      router.push('/admin/blog/panel')
    }
    catch (error) {
      console.error('Login failed:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  const register = async (email: string, username: string, password: string) => {
    loading.value = true

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      // @ts-expect-error displayName
      user.value.displayName = username
      await updateProfile(user.value, { displayName: username })

      await createUserData(user.value, username)

      router.push('/admin/blog/panel')
    }
    catch (error) {
      if (user.value) {
        await user.value.delete()
        await logout()
      }

      console.error('Registration failed:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  onAuthStateChanged(
    auth,
    (newUser: User | null) => {
      if (newUser) {
        user.value = newUser
        fetchUserData(newUser)
      }
    },
  )

  return {
    user,
    userData,
    loading,
    login,
    register,
    logout,
  }
})
