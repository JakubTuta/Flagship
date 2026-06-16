import { collection, getDocs, query } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import type { IResume } from '~/models/resume'
import { mapIResumeDecoded } from '~/models/resume'
import type { IResumeSerialized } from '~/models/serialized'

export const useResumeStore = defineStore('resume', () => {
  const resume = ref<IResume | null>(null)
  const loading = ref(false)
  const resumePdfUrls = ref<{ en: string | null, pl: string | null }>({ en: null, pl: null })
  const loadingPdfs = ref(false)

  const { firestore, storage } = useFirebase()

  const fetchResume = async () => {
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

  const fetchResumePdfs = async () => {
    if (!storage || import.meta.server) {
      return
    }

    loadingPdfs.value = true

    try {
      const enPdfRef = storageRef(storage, 'resume/resume_en.pdf')
      const plPdfRef = storageRef(storage, 'resume/resume_pl.pdf')

      const [enUrl, plUrl] = await Promise.all([
        getDownloadURL(enPdfRef).catch((error) => {
          console.error('Error fetching EN PDF:', error)

          return null
        }),
        getDownloadURL(plPdfRef).catch((error) => {
          console.error('Error fetching PL PDF:', error)

          return null
        }),
      ])

      resumePdfUrls.value = { en: enUrl, pl: plUrl }
    }
    catch (error) {
      console.error('Error fetching resume PDFs:', error)
    }
    finally {
      loadingPdfs.value = false
    }
  }

  const downloadResumePdf = (locale: 'en' | 'pl') => {
    const url = resumePdfUrls.value[locale]

    if (!url) {
      console.error(`Resume PDF for locale ${locale} not found`)

      return
    }

    const link = document.createElement('a')
    link.href = url
    link.download = `resume_${locale}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetState = () => {
    resume.value = null
    loading.value = false
    resumePdfUrls.value = { en: null, pl: null }
    loadingPdfs.value = false
  }

  function hydrateResume(serialized: IResumeSerialized) {
    if (resume.value) {
      return
    }

    resume.value = {
      personalInfo: serialized.personalInfo,
      education: serialized.education.map(edu => ({
        institution: edu.institution,
        startDate: new Date(edu.startDate),
        endDate: edu.endDate
          ? new Date(edu.endDate)
          : null,
        field: edu.field,
        specialization: edu.specialization,
        level: edu.level,
      })),
      workExperience: serialized.workExperience.map(exp => ({
        position: exp.position,
        company: exp.company,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate
          ? new Date(exp.endDate)
          : null,
        responsibilities: exp.responsibilities,
      })),
      highlightedProjects: serialized.highlightedProjects.map(project => ({
        name: project.name,
        url: project.url,
        description: project.description,
      })),
      skills: serialized.skills,
      interests: serialized.interests,
      links: serialized.links,
      footerText: serialized.footerText,
      reference: null,
    }
  }

  return {
    resume,
    loading,
    resumePdfUrls,
    loadingPdfs,
    fetchResume,
    fetchResumePdfs,
    downloadResumePdf,
    resetState,
    hydrateResume,
  }
})
