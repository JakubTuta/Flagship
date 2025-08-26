import { collection, doc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore'
import { beforeCreateDoc, beforeUpdateDoc, removeReferenceField } from '~/helpers/modelToDatabase'
import type { IResume } from '~/models/resume'
import { mapIResume, mapIResumeDecoded, mapIResumeEncoded } from '~/models/resume'

export const useResumeStore = defineStore('resume', () => {
  const resume = ref<IResume | null>(null)
  const loading = ref(false)

  const { firestore } = useFirebase()
  const authStore = useAuthStore()

  const fetchResume = async () => {
    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return
    }

    loading.value = true

    try {
      const resumeQuery = query(collection(firestore, 'resume'))
      const querySnapshot = await getDocs(resumeQuery)

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        resume.value = mapIResumeDecoded(doc.data() as any, doc.ref)
      }
      else {
        resume.value = null
      }
    }
    catch (error) {
      console.error('Error fetching resume:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  const createResume = async (resumeData: Partial<IResume>) => {
    if (!authStore.userData?.reference) {
      throw new Error('User not authenticated')
    }

    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return null
    }

    loading.value = true

    try {
      const resumeRef = doc(collection(firestore, 'resume'))
      const newResume = mapIResume(resumeData, resumeRef)
      const encodedData = mapIResumeEncoded(newResume)
      const dataToSave = beforeCreateDoc(removeReferenceField(encodedData))

      await setDoc(resumeRef, dataToSave)
      resume.value = mapIResume(newResume, resumeRef)

      return resume.value
    }
    catch (error) {
      console.error('Error creating resume:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  const updateResume = async (resumeData: Partial<IResume>) => {
    if (!authStore.userData?.reference || !resume.value?.reference) {
      throw new Error('User not authenticated or resume not found')
    }

    // Skip on server side or if firestore is not available
    if (!firestore || import.meta.server) {
      return null
    }

    loading.value = true

    try {
      const updatedResume = mapIResume({ ...resume.value, ...resumeData }, resume.value.reference)
      const encodedData = mapIResumeEncoded(updatedResume)
      const dataToSave = beforeUpdateDoc(removeReferenceField(encodedData))

      await updateDoc(resume.value.reference, dataToSave)
      resume.value = updatedResume

      return resume.value
    }
    catch (error) {
      console.error('Error updating resume:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  const resetState = () => {
    resume.value = null
    loading.value = false
  }

  return {
    resume,
    loading,
    fetchResume,
    createResume,
    updateResume,
    resetState,
  }
})
