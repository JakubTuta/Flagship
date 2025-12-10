/**
 * Composable for adding Schema.org structured data (JSON-LD) to pages
 * This improves SEO by providing rich snippets in search results
 */

interface Person {
  '@type': 'Person'
  'name': string
  'jobTitle'?: string
  'email'?: string
  'url'?: string
  'image'?: string
  'sameAs'?: string[]
}

interface Organization {
  '@type': 'Organization'
  'name': string
  'url': string
  'logo'?: string
  'sameAs'?: string[]
}

interface BreadcrumbItem {
  name: string
  item?: string
}

interface WebSite {
  '@type': 'WebSite'
  'name': string
  'url': string
  'description'?: string
  'potentialAction'?: {
    '@type': 'SearchAction'
    'target': string
    'query-input': string
  }
}

interface ItemList {
  '@type': 'ItemList'
  'itemListElement': Array<{
    '@type': 'ListItem'
    'position': number
    'url': string
    'name': string
  }>
}

export function useStructuredData() {
  const config = useRuntimeConfig()
  const route = useRoute()

  /**
   * Add Organization structured data (for homepage)
   */
  function addOrganization(data: {
    name: string
    description?: string
    logo?: string
    socialLinks?: string[]
  }) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': data.name,
      'url': config.public.siteUrl,
      'logo': data.logo
        ? `${config.public.siteUrl}${data.logo}`
        : undefined,
      'description': data.description,
      'sameAs': data.socialLinks || [],
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(schema),
        },
      ],
    })
  }

  /**
   * Add Person structured data (for resume/about pages)
   */
  function addPerson(data: {
    name: string
    jobTitle?: string
    email?: string
    image?: string
    socialLinks?: string[]
    description?: string
  }) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': data.name,
      'jobTitle': data.jobTitle,
      'email': data.email,
      'image': data.image
        ? `${config.public.siteUrl}${data.image}`
        : undefined,
      'url': config.public.siteUrl,
      'description': data.description,
      'sameAs': data.socialLinks || [],
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(schema),
        },
      ],
    })
  }

  /**
   * Add Article/BlogPosting structured data (for blog posts)
   */
  function addArticle(data: {
    type?: 'Article' | 'BlogPosting'
    headline: string
    description: string
    image?: string
    datePublished?: string
    dateModified?: string
    authorName?: string
    authorUrl?: string
    category?: string
    keywords?: string[]
  }) {
    const publisher: Organization = {
      '@type': 'Organization',
      'name': 'Jakub Tutka Portfolio',
      'url': config.public.siteUrl,
      'logo': `${config.public.siteUrl}/images/profile.jpg`,
    }

    const author: Person = {
      '@type': 'Person',
      'name': data.authorName || 'Jakub Tutka',
      'url': data.authorUrl || config.public.siteUrl,
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': data.type || 'BlogPosting',
      'headline': data.headline,
      'description': data.description,
      'image': data.image
        ? [data.image]
        : undefined,
      'datePublished': data.datePublished,
      'dateModified': data.dateModified || data.datePublished,
      author,
      publisher,
      'mainEntityOfPage': `${config.public.siteUrl}${route.path}`,
      'keywords': data.keywords,
      'articleSection': data.category,
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(schema),
        },
      ],
    })
  }

  /**
   * Add Breadcrumb structured data
   */
  function addBreadcrumbs(items: BreadcrumbItem[]) {
    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem' as const,
      'position': index + 1,
      'name': item.name,
      'item': item.item
        ? `${config.public.siteUrl}${item.item}`
        : undefined,
    }))

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(schema),
        },
      ],
    })
  }

  /**
   * Add WebSite structured data with search action (for homepage)
   */
  function addWebSite(data: {
    name: string
    description?: string
    hasSearch?: boolean
  }) {
    const schema: WebSite = {
      '@type': 'WebSite',
      'name': data.name,
      'url': config.public.siteUrl,
      'description': data.description,
    }

    if (data.hasSearch) {
      schema.potentialAction = {
        '@type': 'SearchAction',
        'target': `${config.public.siteUrl}/blogs?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      }
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(schema),
        },
      ],
    })
  }

  /**
   * Add ItemList structured data (for blog listing pages)
   */
  function addItemList(items: Array<{ name: string, url: string }>) {
    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem' as const,
      'position': index + 1,
      'url': item.url.startsWith('http')
        ? item.url
        : `${config.public.siteUrl}${item.url}`,
      'name': item.name,
    }))

    const schema: ItemList = {
      '@type': 'ItemList',
      itemListElement,
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(schema),
        },
      ],
    })
  }

  return {
    addOrganization,
    addPerson,
    addArticle,
    addBreadcrumbs,
    addWebSite,
    addItemList,
  }
}
