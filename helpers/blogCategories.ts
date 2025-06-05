export type TBlogCategory = 'frontend' | 'backend' | 'fullstack' | 'web dev' | 'data bases' | 'cloud' | 'algorithms' | 'devops' | 'career' | 'productivity' | 'work-life' | 'personal' | 'other'

export const blogCategories: string[] = [
  'frontend',
  'backend',
  'fullstack',
  'web dev',
  'data bases',
  'cloud',
  'algorithms',
  'devops',
  'career',
  'productivity',
  'work-life',
  'personal',
  'other',
]

export function blogCategoriesValues(t: any): TBlogCategory[] {
  return blogCategories.map(category => t(`blog.categories.${category}`) as TBlogCategory)
}
