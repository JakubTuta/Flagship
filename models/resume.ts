import type { DocumentReference } from 'firebase/firestore'
import type { ITranslatedText } from './translatedText'

export interface IPersonalInfo {
  name: string
  title: ITranslatedText
  email: string
  phone: string
  location: ITranslatedText
  birthDate: string
}

export interface IEducation {
  institution: ITranslatedText
  startDate: Date
  endDate: Date | null
  field: ITranslatedText
  specialization: ITranslatedText
  level: ITranslatedText
}

export interface IWorkExperience {
  position: ITranslatedText
  company: string
  startDate: Date
  endDate: Date | null
  responsibilities: ITranslatedText[]
}

export interface IAdditionalActivity {
  title: ITranslatedText
  project: string
  startDate: Date
  endDate: Date | null
  activities: ITranslatedText[]
}

export interface ISkill {
  name: string
  color: string
}

export interface ISkillCategory {
  title: ITranslatedText
  skills: ISkill[]
}

export interface IInterest {
  name: ITranslatedText
  icon: string
  color: string
}

export interface ILink {
  name: ITranslatedText
  url: string
  icon: string
  color: string
}

export interface IResume {
  personalInfo: IPersonalInfo
  education: IEducation[]
  workExperience: IWorkExperience[]
  additionalActivities: IAdditionalActivity[]
  skills: ISkillCategory[]
  interests: IInterest[]
  links: ILink[]
  footerText: ITranslatedText
  reference: DocumentReference | null
}

export function mapIPersonalInfo(data: Partial<IPersonalInfo>): IPersonalInfo {
  return {
    name: data.name || '',
    title: data.title || { en: '', pl: '' },
    email: data.email || '',
    phone: data.phone || '',
    location: data.location || { en: '', pl: '' },
    birthDate: data.birthDate || '',
  }
}

export function mapIEducation(data: Partial<IEducation>): IEducation {
  return {
    institution: data.institution || { en: '', pl: '' },
    startDate: data.startDate || new Date(),
    endDate: data.endDate || null,
    field: data.field || { en: '', pl: '' },
    specialization: data.specialization || { en: '', pl: '' },
    level: data.level || { en: '', pl: '' },
  }
}

export function mapIWorkExperience(data: Partial<IWorkExperience>): IWorkExperience {
  return {
    position: data.position || { en: '', pl: '' },
    company: data.company || '',
    startDate: data.startDate || new Date(),
    endDate: data.endDate || null,
    responsibilities: data.responsibilities || [],
  }
}

export function mapIAdditionalActivity(data: Partial<IAdditionalActivity>): IAdditionalActivity {
  return {
    title: data.title || { en: '', pl: '' },
    project: data.project || '',
    startDate: data.startDate || new Date(),
    endDate: data.endDate || null,
    activities: data.activities || [],
  }
}

export function mapISkill(data: Partial<ISkill>): ISkill {
  return {
    name: data.name || '',
    color: data.color || '',
  }
}

export function mapISkillCategory(data: Partial<ISkillCategory>): ISkillCategory {
  return {
    title: data.title || { en: '', pl: '' },
    skills: data.skills?.map(skill => mapISkill(skill)) || [],
  }
}

export function mapIInterest(data: Partial<IInterest>): IInterest {
  return {
    name: data.name || { en: '', pl: '' },
    icon: data.icon || '',
    color: data.color || '',
  }
}

export function mapILink(data: Partial<ILink>): ILink {
  return {
    name: data.name || { en: '', pl: '' },
    url: data.url || '',
    icon: data.icon || '',
    color: data.color || '',
  }
}

export function mapIResume(data: Partial<IResume>, reference?: DocumentReference): IResume {
  return {
    personalInfo: data.personalInfo
      ? mapIPersonalInfo(data.personalInfo)
      : mapIPersonalInfo({}),
    education: data.education?.map(edu => mapIEducation(edu)) || [],
    workExperience: data.workExperience?.map(exp => mapIWorkExperience(exp)) || [],
    additionalActivities: data.additionalActivities?.map(activity => mapIAdditionalActivity(activity)) || [],
    skills: data.skills?.map(skillCategory => mapISkillCategory(skillCategory)) || [],
    interests: data.interests?.map(interest => mapIInterest(interest)) || [],
    links: data.links?.map(link => mapILink(link)) || [],
    footerText: data.footerText || { en: '', pl: '' },
    reference: reference || null,
  }
}

export function mapIResumeDecoded(data: any, reference?: DocumentReference): IResume {
  const decoded = { ...data }

  if (decoded.education) {
    decoded.education = decoded.education.map((edu: any) => ({
      ...edu,
      startDate: edu.startDate?.toDate() || new Date(),
      endDate: edu.endDate?.toDate() || null,
    }))
  }

  if (decoded.workExperience) {
    decoded.workExperience = decoded.workExperience.map((exp: any) => ({
      ...exp,
      startDate: exp.startDate?.toDate() || new Date(),
      endDate: exp.endDate?.toDate() || null,
    }))
  }

  if (decoded.additionalActivities) {
    decoded.additionalActivities = decoded.additionalActivities.map((activity: any) => ({
      ...activity,
      startDate: activity.startDate?.toDate() || new Date(),
      endDate: activity.endDate?.toDate() || null,
    }))
  }

  return mapIResume(decoded, reference)
}

export function mapIResumeEncoded(resume: IResume): any {
  const encoded = { ...resume }

  if (encoded.education) {
    encoded.education = encoded.education.map(edu => ({
      ...edu,
      startDate: edu.startDate,
      endDate: edu.endDate,
    }))
  }

  if (encoded.workExperience) {
    encoded.workExperience = encoded.workExperience.map(exp => ({
      ...exp,
      startDate: exp.startDate,
      endDate: exp.endDate,
    }))
  }

  if (encoded.additionalActivities) {
    encoded.additionalActivities = encoded.additionalActivities.map(activity => ({
      ...activity,
      startDate: activity.startDate,
      endDate: activity.endDate,
    }))
  }

  return encoded
}
