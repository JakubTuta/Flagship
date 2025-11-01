<script setup lang="ts">
import type { DocumentReference } from 'firebase/firestore'
import { type TBlogCategory, blogCategoriesValues } from '~/helpers/blogCategories'
import type { IBlog, ITableOfContentsItem } from '~/models/blog'
import { mapIBlogEncoded } from '~/models/blog'
import type { IWorkingBlog } from '~/models/workingBlog'
import { mapIWorkingBlogEncoded } from '~/models/workingBlog'

definePageMeta({ middleware: ['auth'] })

const blogTitle = ref<string | null>(null)
const blogContent = ref('')
const isPreviewMode = ref(false)
const textEditor = ref<HTMLElement | null>(null)
const selectionStart = ref(0)
const selectionEnd = ref(0)
const savedBlog = ref<IBlog | null>(null)
const savedWorkingBlog = ref<IWorkingBlog | null>(null)
const loading = ref(false)
const currentWorkingBlog = ref<IWorkingBlog | null>(null)
const autoSaveTimer = ref<NodeJS.Timeout | null>(null)
const category = ref<TBlogCategory | null>(null)
const isFeatured = ref(false)
const mainLanguage = ref<'pl' | 'en' | null>('pl')
const links = ref<string[]>([])
const blogImage = ref<string | null>(null)

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const { userData } = storeToRefs(authStore)

const blogStore = useBlogStore()

// Scroll detection for smart toolbar
const isToolbarFixed = ref(false)
const toolbarContainer = ref<HTMLElement | null>(null)

// Auto-save function
async function autoSaveWorkingBlog() {
  const trimmedTitle = blogTitle.value?.trim() || ''
  if (!trimmedTitle && !blogContent.value.trim()) {
    return
  }

  try {
    const sanitizedValue = trimmedTitle
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase()

    const workingBlog = mapIWorkingBlogEncoded({
      title: trimmedTitle,
      value: sanitizedValue,
      content: blogContent.value,
      author: userData.value?.reference || null,
      category: category.value || 'other',
      mainLanguage: mainLanguage.value || 'en',
      reference: currentWorkingBlog.value?.reference || null,
    })

    await blogStore.saveWorkingBlog(workingBlog)
    currentWorkingBlog.value = workingBlog
  }
  catch (error) {
    console.error('Error auto-saving working blog:', error)
  }
}

// Start auto-save timer
function startAutoSave() {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
  }

  autoSaveTimer.value = setInterval(() => {
    autoSaveWorkingBlog()
  }, 5 * 60 * 1000) // 5 minutes in milliseconds
}

// Stop auto-save timer
function stopAutoSave() {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
    autoSaveTimer.value = null
  }
}

// Start auto-save when component mounts
onMounted(() => {
  startAutoSave()
  setupScrollListener()
})

// Stop auto-save when component unmounts
onUnmounted(() => {
  stopAutoSave()
  removeScrollListener()
})

// Scroll listener setup
function setupScrollListener() {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial position
}

function removeScrollListener() {
  window.removeEventListener('scroll', handleScroll)
}

function handleScroll() {
  if (!toolbarContainer.value)
    return

  const containerRect = toolbarContainer.value.getBoundingClientRect()
  const isContainerVisible = containerRect.top >= 0

  isToolbarFixed.value = !isContainerVisible
}

watch(userData, async (newUser) => {
  const param = route.query.blogId as string

  if (param && newUser && !savedBlog.value)
    savedBlog.value = await blogStore.getBlog(userData.value, param as string)

  if (param && newUser && !savedWorkingBlog.value && !savedBlog.value)
    savedWorkingBlog.value = await blogStore.getWorkingBlog(userData.value, param as string)
}, { immediate: true })

watch(savedBlog, (newBlog) => {
  if (newBlog) {
    blogTitle.value = newBlog.title[locale.value]
    blogContent.value = newBlog.content[locale.value]
    category.value = newBlog.category as TBlogCategory
    isFeatured.value = newBlog.featured || false
    mainLanguage.value = newBlog.mainLanguage || 'pl'
    links.value = newBlog.links || []
    blogImage.value = newBlog.image || null
  }
})

watch(savedWorkingBlog, (newWorkingBlog) => {
  if (newWorkingBlog && !savedBlog.value) {
    blogTitle.value = newWorkingBlog.title
    blogContent.value = newWorkingBlog.content
    category.value = newWorkingBlog.category as TBlogCategory
    mainLanguage.value = newWorkingBlog.mainLanguage || 'pl'
    links.value = newWorkingBlog.links || []
    blogImage.value = newWorkingBlog.image || null
  }
})

const toolbarControls = computed(() => [
  {
    id: 'bold',
    icon: 'mdi-format-bold',
    tooltip: t('admin.blog.create.boldTooltip'),
    action: toggleBold,
    shortcut: 'b',
  },
  {
    id: 'italic',
    icon: 'mdi-format-italic',
    tooltip: t('admin.blog.create.italicTooltip'),
    action: toggleItalic,
    shortcut: 'i',
  },
  {
    id: 'underline',
    icon: 'mdi-format-underline',
    tooltip: t('admin.blog.create.underlineTooltip'),
    action: toggleUnderline,
    shortcut: 'u',
  },
  {
    id: 'header',
    icon: 'mdi-format-header-1',
    tooltip: t('admin.blog.create.headerTooltip'),
    action: insertHeader,
  },
  {
    id: 'subheader',
    icon: 'mdi-format-header-2',
    tooltip: t('admin.blog.create.subheaderTooltip'),
    action: insertSubheader,
  },
  {
    id: 'list',
    icon: 'mdi-format-list-bulleted',
    tooltip: t('admin.blog.create.listTooltip'),
    action: insertList,
  },
  {
    id: 'numbered-list',
    icon: 'mdi-format-list-numbered',
    tooltip: t('admin.blog.create.numberedListTooltip'),
    action: insertNumberedList,
  },
  {
    id: 'inline-code',
    icon: 'mdi-code-tags',
    tooltip: t('admin.blog.create.inlineCodeTooltip'),
    action: insertInlineCode,
  },
  {
    id: 'code-block',
    icon: 'mdi-code-block-tags',
    tooltip: t('admin.blog.create.codeBlockTooltip'),
    action: insertCodeBlock,
  },
  {
    id: 'image',
    icon: 'mdi-image',
    tooltip: t('admin.blog.create.imageTooltip'),
    action: insertImage,
  },
  {
    id: 'link',
    icon: 'mdi-link',
    tooltip: t('admin.blog.create.linkTooltip'),
    action: insertLink,
  },
  {
    id: 'table',
    icon: 'mdi-table',
    tooltip: t('admin.blog.create.tableTooltip'),
    action: insertTable,
  },
])

const keyboardShortcuts = {
  b: { action: toggleBold, requiresCtrl: true },
  i: { action: toggleItalic, requiresCtrl: true },
  u: { action: toggleUnderline, requiresCtrl: true },
}

function updateSelection() {
  if (textEditor.value?.focus) {
    const textarea = getTextareaElement()
    if (textarea) {
      selectionStart.value = textarea.selectionStart
      selectionEnd.value = textarea.selectionEnd
    }
  }
}

function getTextareaElement() {
  // @ts-expect-error HTMLElement
  return textEditor.value?.$el?.querySelector('textarea')
}

// ========================
// TEXT INSERTION UTILITIES
// ========================
function insertAtCursor(text: string, cursorOffset: number = 0) {
  const textarea = getTextareaElement()
  if (!textarea)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const beforeText = blogContent.value.slice(0, start)
  const afterText = blogContent.value.slice(end)

  blogContent.value = beforeText + text + afterText

  nextTick(() => {
    textarea.focus()
    const newPosition = start + text.length + cursorOffset
    textarea.setSelectionRange(newPosition, newPosition)
  })
}

function wrapSelectedText(startWrapper: string, endWrapper: string = startWrapper) {
  const textarea = getTextareaElement()
  if (!textarea)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = blogContent.value.slice(start, end)

  if (selectedText) {
    const beforeText = blogContent.value.slice(0, start)
    const afterText = blogContent.value.slice(end)

    // Check if text is already wrapped
    if (selectedText.startsWith(startWrapper) && selectedText.endsWith(endWrapper)) {
      // Remove formatting
      const unwrappedText = selectedText.slice(startWrapper.length, -endWrapper.length)
      blogContent.value = beforeText + unwrappedText + afterText

      nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + unwrappedText.length)
      })
    }
    else {
      // Add formatting
      const wrappedText = startWrapper + selectedText + endWrapper
      blogContent.value = beforeText + wrappedText + afterText

      nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + startWrapper.length, end + startWrapper.length)
      })
    }
  }
  else {
    // No selection - check if cursor is inside empty wrappers
    const beforeText = blogContent.value.slice(0, start)
    const afterText = blogContent.value.slice(end)

    // Check if cursor is between empty wrappers
    if (beforeText.endsWith(startWrapper) && afterText.startsWith(endWrapper)) {
      // Remove the empty wrappers
      const newBeforeText = beforeText.slice(0, -startWrapper.length)
      const newAfterText = afterText.slice(endWrapper.length)
      blogContent.value = newBeforeText + newAfterText

      nextTick(() => {
        textarea.focus()
        const newPosition = start - startWrapper.length
        textarea.setSelectionRange(newPosition, newPosition)
      })
    }
    else {
      // No selection, insert wrappers and position cursor
      const wrapperText = startWrapper + endWrapper
      insertAtCursor(wrapperText, -endWrapper.length)
    }
  }
}

// ========================
// IMAGE HANDLING
// ========================
function uploadBlogImage() {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.style.display = 'none'

  fileInput.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file)
      return

    try {
      loading.value = true

      // Convert file to base64 string
      const base64String = await fileToBase64(file)

      // Upload image using blogStore
      const imageUrl = await blogStore.addImage(base64String)

      // Set as blog header image
      blogImage.value = imageUrl
    }
    catch (error) {
      console.error('Error uploading blog header image:', error)
      // You might want to show a user-friendly error message here
    }
    finally {
      loading.value = false
    }
  })

  // Trigger file selection
  document.body.appendChild(fileInput)
  fileInput.click()
  document.body.removeChild(fileInput)
}

// Remove blog header image
function removeBlogImage() {
  blogImage.value = null
}

function insertImage() {
  // Create a file input element
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.style.display = 'none'

  fileInput.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file)
      return

    try {
      // Convert file to base64 string
      const base64String = await fileToBase64(file)

      // Upload image using blogStore
      const imageUrl = await blogStore.addImage(base64String)

      // Check if current line is empty
      const textarea = getTextareaElement()
      if (!textarea)
        return

      const start = textarea.selectionStart
      const beforeText = blogContent.value.slice(0, start)
      const lines = beforeText.split('\n')
      const currentLine = lines[lines.length - 1]

      // Create simple image tag with only src
      const imageTag = `<img src="${imageUrl}">`

      // Insert image tag - add newline before only if current line is not empty
      if (currentLine.trim() !== '') {
        insertAtCursor(`\n${imageTag}`)
      }
      else {
        insertAtCursor(imageTag)
      }
    }
    catch (error) {
      console.error('Error uploading image:', error)
      // You might want to show a user-friendly error message here
    }
  })

  // Trigger file selection
  document.body.appendChild(fileInput)
  fileInput.click()
  document.body.removeChild(fileInput)
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

// ========================
// FORMATTING ACTIONS
// ========================
function insertHeader() {
  const randomId = generateRandomText()
  wrapSelectedText(`<h2 id="${randomId}">\n`, '\n</h2>')
}

function insertSubheader() {
  const randomId = generateRandomText()
  wrapSelectedText(`<h3 id="${randomId}">\n`, '\n</h3>')
}

function toggleBold() {
  wrapSelectedText('<strong>', '</strong>')
}

function toggleItalic() {
  wrapSelectedText('<em>', '</em>')
}

function toggleUnderline() {
  wrapSelectedText('<u>', '</u>')
}

function insertInlineCode() {
  wrapSelectedText('<code>', '</code>')
}

function insertLink() {
  wrapSelectedText('<a href="">', '</a>')
}

function insertTable() {
  const tableHtml = `<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
    </tr>
  </tbody>
</table>`

  const textarea = getTextareaElement()
  if (!textarea)
    return

  const start = textarea.selectionStart
  const beforeText = blogContent.value.slice(0, start)
  const lines = beforeText.split('\n')
  const currentLine = lines[lines.length - 1]

  // Insert table - add newline before only if current line is not empty
  if (currentLine.trim() !== '') {
    insertAtCursor(`\n${tableHtml}\n`)
  }
  else {
    insertAtCursor(`${tableHtml}\n`)
  }
}

function insertList() {
  const textarea = getTextareaElement()
  if (!textarea)
    return

  const start = textarea.selectionStart
  const beforeText = blogContent.value.slice(0, start)
  const afterText = blogContent.value.slice(start)

  // Find the current line
  const lines = beforeText.split('\n')
  const currentLine = lines[lines.length - 1]

  if (currentLine === '- ') {
    // Current line only contains '- ', remove it
    const newBeforeText = lines.slice(0, -1).join('\n')
    const separator = newBeforeText
      ? '\n'
      : ''
    blogContent.value = newBeforeText + separator + afterText

    nextTick(() => {
      textarea.focus()
      const newPosition = newBeforeText.length + (separator
        ? 1
        : 0)
      textarea.setSelectionRange(newPosition, newPosition)
    })
  }
  else if (currentLine.trim() === '') {
    // Current line is empty, just add '- '
    insertAtCursor('- ')
  }
  else {
    // Current line has content, add new line with '- '
    insertAtCursor('\n- ')
  }
}

function insertNumberedList() {
  const textarea = getTextareaElement()
  if (!textarea)
    return

  const start = textarea.selectionStart
  const beforeText = blogContent.value.slice(0, start)
  const afterText = blogContent.value.slice(start)

  // Find the current line
  const lines = beforeText.split('\n')
  const currentLine = lines[lines.length - 1]

  // Check if current line is a numbered list
  const numberedListMatch = currentLine.match(/^(\d+)\. (.*)$/)
  const subNumberedListMatch = currentLine.match(/^(\d+)\.(\d+)\. (.*)$/)
  const emptyNumberedMatch = currentLine.match(/^(\d+)\. $/)
  const emptySubNumberedMatch = currentLine.match(/^(\d+)\.(\d+)\. $/)

  // 1. Line is not empty and is not a numbered list
  if (currentLine.trim() !== '' && !numberedListMatch && !subNumberedListMatch && !emptyNumberedMatch && !emptySubNumberedMatch) {
    insertAtCursor('\n1. ')

    return
  }

  // 2. Line is empty and previous line is not a numbered list
  if (currentLine.trim() === '') {
    const previousLine = lines.length >= 2
      ? lines[lines.length - 2]
      : ''
    const prevNumberedMatch = previousLine.match(/^(\d+)\. /)
    const prevSubNumberedMatch = previousLine.match(/^(\d+)\.(\d+)\. /)

    if (!prevNumberedMatch && !prevSubNumberedMatch) {
      insertAtCursor('1. ')

      return
    }
  }

  // 3. Line is empty but is a numbered list - cycle through levels
  if (emptyNumberedMatch) {
    // Check if there's a previous line to make this a sub-item of
    const previousLine = lines.length >= 2
      ? lines[lines.length - 2]
      : ''
    const prevNumberedMatch = previousLine.match(/^(\d+)\. /)

    if (prevNumberedMatch) {
      // Convert to sub-item of previous line (e.g., '3. ' becomes '2.1. ' if previous was '2. content')
      const prevNum = prevNumberedMatch[1]
      const newBeforeText = lines.slice(0, -1).join('\n')
      const separator = newBeforeText
        ? '\n'
        : ''
      blogContent.value = `${newBeforeText + separator}${prevNum}.1. ${afterText}`

      nextTick(() => {
        textarea.focus()
        const newPosition = newBeforeText.length + separator.length + `${prevNum}.1. `.length
        textarea.setSelectionRange(newPosition, newPosition)
      })
    }
    else {
      // No previous numbered line, use current number for sub-item
      const mainNum = emptyNumberedMatch[1]
      const newBeforeText = lines.slice(0, -1).join('\n')
      const separator = newBeforeText
        ? '\n'
        : ''
      blogContent.value = `${newBeforeText + separator}${mainNum}.1. ${afterText}`

      nextTick(() => {
        textarea.focus()
        const newPosition = newBeforeText.length + separator.length + `${mainNum}.1. `.length
        textarea.setSelectionRange(newPosition, newPosition)
      })
    }

    return
  }

  if (emptySubNumberedMatch) {
    // From '1.1. ' to empty line
    const newBeforeText = lines.slice(0, -1).join('\n')
    const separator = newBeforeText
      ? '\n'
      : ''
    blogContent.value = newBeforeText + separator + afterText

    nextTick(() => {
      textarea.focus()
      const newPosition = newBeforeText.length + (separator
        ? 1
        : 0)
      textarea.setSelectionRange(newPosition, newPosition)
    })

    return
  }

  // 4. Line is not empty and is a numbered list - add new line with +1 number
  if (numberedListMatch) {
    // Main numbered list with content (e.g., "1. some content")
    const nextNum = Number.parseInt(numberedListMatch[1]) + 1
    insertAtCursor(`\n${nextNum}. `)

    return
  }

  if (subNumberedListMatch) {
    // Sub-numbered list with content (e.g., "1.2. some content")
    const mainNum = subNumberedListMatch[1]
    const subNum = Number.parseInt(subNumberedListMatch[2]) + 1
    insertAtCursor(`\n${mainNum}.${subNum}. `)

    return
  }

  // Fallback: empty line, previous line is numbered - continue the sequence
  if (currentLine.trim() === '') {
    const previousLine = lines.length >= 2
      ? lines[lines.length - 2]
      : ''
    const prevNumberedMatch = previousLine.match(/^(\d+)\. /)
    const prevSubNumberedMatch = previousLine.match(/^(\d+)\.(\d+)\. /)

    if (prevSubNumberedMatch) {
      const mainNum = prevSubNumberedMatch[1]
      const subNum = Number.parseInt(prevSubNumberedMatch[2]) + 1
      insertAtCursor(`${mainNum}.${subNum}. `)
    }
    else if (prevNumberedMatch) {
      const nextNum = Number.parseInt(prevNumberedMatch[1]) + 1
      insertAtCursor(`${nextNum}. `)
    }
  }
}

function insertCodeBlock() {
  const textarea = getTextareaElement()
  if (!textarea)
    return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const beforeText = blogContent.value.slice(0, start)
  const afterText = blogContent.value.slice(end)

  // Split content into lines to analyze code block structure
  const beforeLines = beforeText.split('\n')
  const afterLines = afterText.split('\n')

  // Find the current line where cursor is positioned
  const currentLineText = beforeLines[beforeLines.length - 1] + afterLines[0]

  // Look for opening ``` line (can be just ``` or ```language)
  let openingLineIndex = -1
  for (let i = beforeLines.length - 1; i >= 0; i--) {
    const line = beforeLines[i].trim()
    if (line.startsWith('```')) {
      openingLineIndex = i
      break
    }
    // If we hit content (non-empty line that's not whitespace), stop looking
    if (line && !line.match(/^\s*$/)) {
      break
    }
  }

  // Look for closing ``` line
  let closingLineIndex = -1
  for (let i = 0; i < afterLines.length; i++) {
    const line = afterLines[i].trim()
    if (line === '```') {
      closingLineIndex = i
      break
    }
    // If we hit content (non-empty line that's not whitespace), stop looking
    if (line && !line.match(/^\s*$/)) {
      break
    }
  }

  // Check if cursor is inside an empty code block
  if (openingLineIndex !== -1 && closingLineIndex !== -1) {
    // Check if there's only whitespace between the opening and closing
    const contentBetween = beforeLines.slice(openingLineIndex + 1).join('\n')
      + afterLines.slice(0, closingLineIndex).join('\n')

    if (!contentBetween.trim()) {
      // Remove the empty code block
      const newBeforeLines = beforeLines.slice(0, openingLineIndex)
      const newAfterLines = afterLines.slice(closingLineIndex + 1)

      const newBeforeText = newBeforeLines.join('\n')
      const newAfterText = newAfterLines.join('\n')

      // Add newline separator if needed
      const separator = (newBeforeText && newAfterText)
        ? '\n'
        : ''
      blogContent.value = newBeforeText + separator + newAfterText

      nextTick(() => {
        textarea.focus()
        const newPosition = newBeforeText.length + (separator
          ? 1
          : 0)
        textarea.setSelectionRange(newPosition, newPosition)
      })

      return
    }
  }

  let codeBlock = ''
  if (!currentLineText.trim().length)
    codeBlock = '```\n\n```\n'
  else
    codeBlock = '\n```\n\n```\n'

  insertAtCursor(codeBlock, -5) // Position cursor inside code block
}

// ========================
// EVENT HANDLERS
// ========================
function handleKeydown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey) {
    const shortcut = keyboardShortcuts[event.key as keyof typeof keyboardShortcuts]
    if (shortcut) {
      event.preventDefault()
      shortcut.action()
    }
  }

  // Handle Enter key for list continuation
  if (event.key === 'Enter') {
    const textarea = getTextareaElement()
    if (!textarea)
      return

    const start = textarea.selectionStart
    const beforeText = blogContent.value.slice(0, start)
    const afterText = blogContent.value.slice(start)
    const lines = beforeText.split('\n')
    const currentLine = lines[lines.length - 1]

    // Check if current line is empty bullet list item ('- ')
    if (currentLine === '- ') {
      event.preventDefault()
      // Remove the '- ' from current line
      const newBeforeText = lines.slice(0, -1).join('\n')
      const separator = newBeforeText
        ? '\n'
        : ''
      blogContent.value = newBeforeText + separator + afterText

      nextTick(() => {
        textarea.focus()
        const newPosition = newBeforeText.length + (separator
          ? 1
          : 0)
        textarea.setSelectionRange(newPosition, newPosition)
      })

      return
    }

    // Check if current line starts with '- ' and has content
    if (currentLine.trim().startsWith('- ') && currentLine.trim() !== '- ') {
      event.preventDefault()
      insertAtCursor('\n- ')

      return
    }

    // Check for numbered list patterns
    const numberedListMatch = currentLine.match(/^(\d+)\. (.*)$/)
    const subNumberedListMatch = currentLine.match(/^(\d+)\.(\d+)\. (.*)$/)
    const emptyNumberedMatch = currentLine.match(/^(\d+)\. $/)
    const emptySubNumberedMatch = currentLine.match(/^(\d+)\.(\d+)\. $/)

    // Handle empty numbered list items
    if (emptyNumberedMatch) {
      event.preventDefault()
      const newBeforeText = lines.slice(0, -1).join('\n')
      const separator = newBeforeText
        ? '\n'
        : ''

      // Find the previous line with content to determine the correct main number
      let correctMainNum = '1'
      for (let i = lines.length - 2; i >= 0; i--) {
        const line = lines[i]
        const prevNumberedMatch = line.match(/^(\d+)\. /)
        if (prevNumberedMatch) {
          correctMainNum = prevNumberedMatch[1]
          break
        }
      }

      // Convert to sub-item using the correct main number
      blogContent.value = `${newBeforeText}${separator}${correctMainNum}.1. ${afterText}`

      nextTick(() => {
        textarea.focus()
        const newPosition = newBeforeText.length + separator.length + `${correctMainNum}.1. `.length
        textarea.setSelectionRange(newPosition, newPosition)
      })

      return
    }

    if (emptySubNumberedMatch) {
      event.preventDefault()
      // Remove the empty sub-numbered list item
      const newBeforeText = lines.slice(0, -1).join('\n')
      const separator = newBeforeText
        ? '\n'
        : ''
      blogContent.value = newBeforeText + separator + afterText

      nextTick(() => {
        textarea.focus()
        const newPosition = newBeforeText.length + (separator
          ? 1
          : 0)
        textarea.setSelectionRange(newPosition, newPosition)
      })

      return
    }

    // Handle numbered lists with content
    if (numberedListMatch) {
      event.preventDefault()
      const nextNum = Number.parseInt(numberedListMatch[1]) + 1
      insertAtCursor(`\n${nextNum}. `)

      return
    }

    if (subNumberedListMatch) {
      // Handle sub-numbered list (e.g., "1.1. some content")
      event.preventDefault()
      const mainNum = subNumberedListMatch[1]
      const subNum = Number.parseInt(subNumberedListMatch[2]) + 1
      insertAtCursor(`\n${mainNum}.${subNum}. `)
    }
  }
}

function togglePreviewMode() {
  isPreviewMode.value = !isPreviewMode.value
}

// ========================
// BLOG MANAGEMENT
// ========================
function clearContent() {
  blogContent.value = ''
}

function stripHtmlTags(text: string): string {
  // Remove all HTML tags from text
  return text.replace(/<[^>]*>/g, '').trim()
}

function generateTableOfContents(content: string): ITableOfContentsItem[] {
  const tableOfContents: ITableOfContentsItem[] = []
  let currentHeaderLevel = 0
  let subHeaderCount = 0

  // Find all header and subheader tags - updated regex to handle multiline content
  const headerRegex = /<(h2|h3) id="([^"]+)"[^>]*>([^<]*(?:<(?!\/\1>)[^<]*)*)<\/\1>/g
  const matches = Array.from(content.matchAll(headerRegex))

  for (const match of matches) {
    const [, tagType, id, titleText] = match
    // Strip HTML tags from title text for clean TOC display
    const cleanTitle = stripHtmlTags(titleText)

    if (tagType === 'h2') {
      currentHeaderLevel++
      subHeaderCount = 0 // Reset subheader count for new header

      tableOfContents.push({
        title: { en: cleanTitle, pl: cleanTitle }, // Will be translated later
        id,
        mainLevel: currentHeaderLevel,
        subLevel: null,
      })
    }
    else if (tagType === 'h3') {
      subHeaderCount++
      const mainLevel = currentHeaderLevel > 0
        ? currentHeaderLevel
        : 1

      tableOfContents.push({
        title: { en: cleanTitle, pl: cleanTitle }, // Will be translated later
        id,
        mainLevel,
        subLevel: subHeaderCount,
      })
    }
  }

  return tableOfContents
}

async function prepareBlog(isPublished: boolean, reference: DocumentReference | null) {
  const trimmedTitle = blogTitle.value?.trim() || ''
  const translatedTitle = await translateText(trimmedTitle, mainLanguage.value)
  const translatedContent = await translateText(blogContent.value, mainLanguage.value)

  const tableOfContents = generateTableOfContents(blogContent.value)

  const translatedTableOfContents = await Promise.all(
    tableOfContents.map(async item => ({
      ...item,
      title: await translateText(item.title.en, mainLanguage.value),
    })),
  )

  const value = savedBlog.value?.value || savedWorkingBlog.value?.value || translatedTitle.en.replace(/\s+/g, '-').toLowerCase()

  return mapIBlogEncoded({
    title: translatedTitle,
    value,
    content: translatedContent,
    isPublished,
    featured: isFeatured.value,
    category: category.value || 'other',
    author: userData.value?.reference || null,
    tableOfContents: translatedTableOfContents,
    links: links.value,
    image: blogImage.value || null,
    mainLanguage: mainLanguage.value || 'pl',
  }, reference)
}

async function saveDraft() {
  if (!blogTitle.value?.trim() || !blogContent.value?.trim() || !category.value) {
    console.error('Title, content, and category are required to save a draft.')

    return
  }

  loading.value = true
  const reference = savedBlog.value?.reference || savedWorkingBlog.value?.reference || null
  const blog = await prepareBlog(false, reference)

  if (savedBlog.value || savedWorkingBlog.value) {
    blogStore.updateBlog(reference, blog)
  }
  else {
    blogStore.createBlog(blog)
  }

  loading.value = false

  router.push('/admin/blog/panel')
}

async function publishBlog() {
  if (!blogTitle.value?.trim() || !blogContent.value?.trim() || !category.value) {
    console.error('Title, content, and category are required to publish the blog.')

    return
  }

  loading.value = true
  const reference = savedBlog.value?.reference || savedWorkingBlog.value?.reference || null
  const blog = await prepareBlog(true, reference)

  if (savedBlog.value || savedWorkingBlog.value) {
    blogStore.updateBlog(reference, blog)
  }
  else {
    blogStore.createBlog(blog)
  }

  loading.value = false

  router.push('/admin/blog/panel')
}

async function deleteCurrentWorkingBlog() {
  if (currentWorkingBlog.value) {
    await blogStore.deleteWorkingBlog(userData.value, currentWorkingBlog.value)
    currentWorkingBlog.value = null
    stopAutoSave()
  }
}

async function deleteBlog() {
  deleteCurrentWorkingBlog()

  if (!savedBlog.value && !savedWorkingBlog.value)
    return

  loading.value = true

  if (savedBlog.value) {
    await blogStore.deleteBlog(userData.value, savedBlog.value)
  }

  if (savedWorkingBlog.value) {
    await blogStore.deleteWorkingBlog(userData.value, savedWorkingBlog.value)
  }

  loading.value = false

  router.push('/admin/blog/panel')
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container>
    <v-card :loading="loading">
      <v-card-title>
        <h2>
          {{ savedBlog || savedWorkingBlog
            ? $t('admin.blog.create.editTitle')
            : $t('admin.blog.create.createTitle') }}
        </h2>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="blogTitle"
          :label="$t('admin.blog.create.titleInput')"
          class="mt-2"
          clearable
        />

        <v-row class="ma-0">
          <v-select
            v-model="category"
            :items="blogCategoriesValues(t)"
            :label="$t('admin.blog.create.categoryInput')"
            class="max-w-400px"
            clearable
          />

          <v-select
            v-model="mainLanguage"
            :items="[
              {
                'title': $t('admin.blog.create.languageEnglish'),
                'value': 'en',
              },
              {
                'title': $t('admin.blog.create.languagePolish'),
                'value': 'pl',
              },
            ]"
            :label="$t('admin.blog.create.languageInput')"
            class="ml-4 max-w-200px"
          />

          <v-checkbox
            v-model="isFeatured"
            :label="$t('admin.blog.create.featuredCheckbox')"
            color="primary"
            class="ml-4"
          />
        </v-row>

        <div class="blog-image-section mb-4">
          <v-card
            v-if="blogImage"
            class="blog-image-preview mb-3"
            variant="outlined"
          >
            <v-img
              :src="blogImage"
              height="200"
              cover
              class="blog-header-image"
            >
              <template #placeholder>
                <div class="d-flex align-center fill-height justify-center">
                  <v-progress-circular indeterminate />
                </div>
              </template>
            </v-img>

            <v-card-actions class="pa-2">
              <v-spacer />

              <v-btn
                color="error"
                variant="text"
                size="small"
                prepend-icon="mdi-delete"
                @click="removeBlogImage"
              >
                {{ $t('admin.blog.create.removeImage') }}
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-btn
            v-else
            color="primary"
            variant="outlined"
            prepend-icon="mdi-image-plus"
            class="mb-3"
            @click="uploadBlogImage"
          >
            {{ $t('admin.blog.create.addHeaderImage') }}
          </v-btn>
        </div>

        <!-- Toolbar Container -->
        <div
          ref="toolbarContainer"
          class="toolbar-container"
        >
          <v-toolbar
            density="compact"
            class="smart-toolbar"
            color="surface"
            elevation="2"
          >
            <v-btn
              v-for="control in toolbarControls"
              :key="control.id"
              icon
              size="small"
              class="mx-1"
              @click="control.action"
            >
              <v-icon>
                {{ control.icon }}
              </v-icon>

              <v-tooltip
                :text="control.tooltip"
                location="bottom"
                activator="parent"
              />
            </v-btn>

            <v-spacer />

            <v-btn
              :color="isPreviewMode
                ? 'success'
                : 'primary'"
              class="mr-4"
              size="small"
              @click="togglePreviewMode"
            >
              <v-icon class="mr-1">
                {{ isPreviewMode
                  ? 'mdi-text'
                  : 'mdi-eye' }}
              </v-icon>
              {{ isPreviewMode
                ? $t('admin.blog.create.raw')
                : $t('admin.blog.create.preview') }}

              <v-tooltip
                :text="isPreviewMode
                  ? $t('admin.blog.create.switchToRaw')
                  : $t('admin.blog.create.switchToPreview')"
                location="bottom"
                activator="parent"
              />
            </v-btn>
          </v-toolbar>
        </div>

        <!-- Fixed Toolbar (shown when original is out of view) -->
        <div
          v-if="isToolbarFixed"
          class="fixed-toolbar-wrapper"
        >
          <v-toolbar
            density="compact"
            class="fixed-toolbar"
            color="surface"
            elevation="4"
          >
            <v-btn
              v-for="control in toolbarControls"
              :key="control.id"
              icon
              size="small"
              class="mx-1"
              @click="control.action"
            >
              <v-icon>
                {{ control.icon }}
              </v-icon>

              <v-tooltip
                :text="control.tooltip"
                location="bottom"
                activator="parent"
              />
            </v-btn>

            <v-spacer />

            <v-btn
              :color="isPreviewMode
                ? 'success'
                : 'primary'"
              class="mr-4"
              size="small"
              @click="togglePreviewMode"
            >
              <v-icon class="mr-1">
                {{ isPreviewMode
                  ? 'mdi-text'
                  : 'mdi-eye' }}
              </v-icon>
              {{ isPreviewMode
                ? $t('admin.blog.create.raw')
                : $t('admin.blog.create.preview') }}

              <v-tooltip
                :text="isPreviewMode
                  ? $t('admin.blog.create.switchToRaw')
                  : $t('admin.blog.create.switchToPreview')"
                location="bottom"
                activator="parent"
              />
            </v-btn>
          </v-toolbar>
        </div>

        <!-- Text Editor / Preview -->
        <div v-if="!isPreviewMode">
          <v-textarea
            ref="textEditor"
            v-model="blogContent"
            :placeholder="$t('admin.blog.create.contentPlaceholder')"
            rows="15"
            auto-grow
            class="blog-textarea"
            @keydown="handleKeydown"
            @select="updateSelection"
            @click="updateSelection"
          />
        </div>

        <v-card
          v-else
          class="blog-content-card mb-8"
          elevation="2"
        >
          <BlogContent
            :blog-content="blogContent"
          />
        </v-card>

        <v-combobox
          v-model="links"
          :label="$t('admin.blog.create.linksInput')"

          clearable
          chips
          multiple
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="grey"
          prepend-icon="mdi-arrow-left"
          to="/admin/blog/panel"
        >
          {{ $t('admin.blog.create.back') }}
        </v-btn>

        <v-btn
          class="mx-2"
          color="grey"
          append-icon="mdi-close"
          @click="clearContent"
        >
          {{ $t('admin.blog.create.clear') }}
        </v-btn>

        <v-btn
          color="error"
          append-icon="mdi-delete"
          @click="deleteBlog"
        >
          {{ $t('admin.blog.create.delete') }}
        </v-btn>

        <v-btn
          color="secondary"
          class="mx-2"
          append-icon="mdi-content-save-outline"
          @click="saveDraft"
        >
          {{ $t('admin.blog.create.saveDraft') }}
        </v-btn>

        <v-btn
          color="primary"
          append-icon="mdi-check"
          @click="publishBlog"
        >
          {{ $t('admin.blog.create.publish') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.toolbar-container {
  margin: 1rem 0 0.5rem 0;
}

.smart-toolbar {
  border-radius: 8px;
}

.fixed-toolbar-wrapper {
  position: fixed;
  top: 64px; /* Adjust based on your app bar height */
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 16px;
}

.fixed-toolbar {
  border-radius: 8px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.v-text-field :deep(input) {
  font-size: 1.5em;
}

.blog-textarea :deep(textarea) {
  font-size: 1.2em !important;
  line-height: 1.5 !important;
}
</style>
