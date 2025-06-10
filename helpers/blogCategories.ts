export type TBlogCategory = 'frontend' | 'backend' | 'fullstack' | 'web dev' | 'data bases' | 'cloud' | 'algorithms' | 'devops' | 'career' | 'productivity' | 'work-life' | 'personal' | 'ai-ml' | 'other'

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
  'ai-ml',
  'other',
]

export function blogCategoriesValues(t: any) {
  return blogCategories.map(category => ({
    title: t(`blog.categories.${category}`),
    value: category,
  }))
}
