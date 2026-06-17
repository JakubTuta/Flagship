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

export interface IHighlightedProject {
  name: ITranslatedText
  url: string
  description: ITranslatedText
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
  highlightedProjects: IHighlightedProject[]
  skills: ISkillCategory[]
  interests: IInterest[]
  links: ILink[]
  footerText: ITranslatedText
}
