import type { IResumeSerialized } from '~/models/serialized'

function toIso(timestamp: any): string {
  if (!timestamp)
    return new Date().toISOString()

  if (typeof timestamp.toDate === 'function')
    return timestamp.toDate().toISOString()

  return new Date(timestamp).toISOString()
}

function toIsoOrNull(timestamp: any): string | null {
  if (timestamp === null || timestamp === undefined)
    return null

  if (typeof timestamp.toDate === 'function')
    return timestamp.toDate().toISOString()

  return new Date(timestamp).toISOString()
}

export default defineEventHandler(async (): Promise<IResumeSerialized | null> => {
  try {
    const firestore = getAdminFirestore()

    const resumeSnapshot = await firestore.collection('resume').limit(1).get()

    if (resumeSnapshot.empty) {
      return null
    }

    const data = resumeSnapshot.docs[0].data()

    return {
      personalInfo: {
        name: data.personalInfo?.name || '',
        title: data.personalInfo?.title || { en: '', pl: '' },
        email: data.personalInfo?.email || '',
        phone: data.personalInfo?.phone || '',
        location: data.personalInfo?.location || { en: '', pl: '' },
        birthDate: data.personalInfo?.birthDate || '',
      },
      education: (data.education || []).map((edu: any) => ({
        institution: edu.institution || { en: '', pl: '' },
        startDate: toIso(edu.startDate),
        endDate: toIsoOrNull(edu.endDate),
        field: edu.field || { en: '', pl: '' },
        specialization: edu.specialization || { en: '', pl: '' },
        level: edu.level || { en: '', pl: '' },
      })),
      workExperience: (data.workExperience || []).map((exp: any) => ({
        position: exp.position || { en: '', pl: '' },
        company: exp.company || '',
        startDate: toIso(exp.startDate),
        endDate: toIsoOrNull(exp.endDate),
        responsibilities: exp.responsibilities || [],
      })),
      additionalActivities: (data.additionalActivities || []).map((act: any) => ({
        title: act.title || { en: '', pl: '' },
        project: act.project || '',
        startDate: toIso(act.startDate),
        endDate: toIsoOrNull(act.endDate),
        activities: act.activities || [],
      })),
      skills: (data.skills || []).map((cat: any) => ({
        title: cat.title || { en: '', pl: '' },
        skills: (cat.skills || []).map((s: any) => ({ name: s.name || '', color: s.color || '' })),
      })),
      interests: (data.interests || []).map((interest: any) => ({
        name: interest.name || { en: '', pl: '' },
        icon: interest.icon || '',
        color: interest.color || '',
      })),
      links: (data.links || []).map((link: any) => ({
        name: link.name || { en: '', pl: '' },
        url: link.url || '',
        icon: link.icon || '',
        color: link.color || '',
      })),
      footerText: data.footerText || { en: '', pl: '' },
    } satisfies IResumeSerialized
  }
  catch (error) {
    console.error('Error fetching resume:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch resume' })
  }
})
