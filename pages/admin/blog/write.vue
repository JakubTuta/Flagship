<script setup lang="ts">
import type { DocumentReference } from 'firebase/firestore'
import { type TBlogCategory, blogCategoriesValues } from '~/helpers/blogCategories'
import type { IBlog, ITableOfContentsItem } from '~/models/blog'
import { mapIBlogEncoded } from '~/models/blog'

definePageMeta({ middleware: ['auth'] })

const blogTitle = ref<string | null>(null)
const blogContent = ref('')
const isPreviewMode = ref(false)
const textEditor = ref<HTMLElement | null>(null)
const selectionStart = ref(0)
const selectionEnd = ref(0)
const isBoldActive = ref(false)
const isItalicActive = ref(false)
const isUnderlineActive = ref(false)
const savedBlog = ref<IBlog | null>(null)
const savedWorkingBlog = ref<IWorkingBlog | null>(null)
const loading = ref(false)
const currentWorkingBlog = ref<IWorkingBlog | null>(null)
const autoSaveTimer = ref<NodeJS.Timeout | null>(null)
const category = ref<TBlogCategory | null>(null)
const isFeatured = ref(false)

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const { userData } = storeToRefs(authStore)

const blogStore = useBlogStore()

// Auto-save function
async function autoSaveWorkingBlog() {
  const trimmedTitle = blogTitle.value?.trim() || ''
  if (!trimmedTitle && !blogContent.value.trim()) {
    return
  }

  try {
    const workingBlog = mapIWorkingBlogEncoded({
      title: trimmedTitle,
      value: trimmedTitle.replace(/\s+/g, '-').toLowerCase(),
      content: blogContent.value,
      author: userData.value?.reference || null,
      category: category.value || 'other',
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
})

// Stop auto-save when component unmounts
onUnmounted(() => {
  stopAutoSave()
})

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
  }
})

watch(savedWorkingBlog, (newWorkingBlog) => {
  if (newWorkingBlog && !savedBlog.value) {
    blogTitle.value = newWorkingBlog.title
    blogContent.value = newWorkingBlog.content
    category.value = newWorkingBlog.category as TBlogCategory
  }
})

const toolbarControls = computed(() => [
  {
    id: 'bold',
    icon: 'mdi-format-bold',
    tooltip: t('admin.blog.create.boldTooltip'),
    action: toggleBold,
    isActive: isBoldActive.value,
    shortcut: 'b',
  },
  {
    id: 'italic',
    icon: 'mdi-format-italic',
    tooltip: t('admin.blog.create.italicTooltip'),
    action: toggleItalic,
    isActive: isItalicActive.value,
    shortcut: 'i',
  },
  {
    id: 'underline',
    icon: 'mdi-format-underline',
    tooltip: t('admin.blog.create.underlineTooltip'),
    action: toggleUnderline,
    isActive: isUnderlineActive.value,
    shortcut: 'u',
  },
  {
    id: 'header',
    icon: 'mdi-format-header-1',
    tooltip: t('admin.blog.create.headerTooltip'),
    action: insertHeader,
    isActive: false,
  },
  {
    id: 'subheader',
    icon: 'mdi-format-header-2',
    tooltip: t('admin.blog.create.subheaderTooltip'),
    action: insertSubheader,
    isActive: false,
  },
  {
    id: 'list',
    icon: 'mdi-format-list-bulleted',
    tooltip: t('admin.blog.create.listTooltip'),
    action: insertList,
    isActive: false,
  },
  {
    id: 'numbered-list',
    icon: 'mdi-format-list-numbered',
    tooltip: t('admin.blog.create.numberedListTooltip'),
    action: insertNumberedList,
    isActive: false,
  },
  {
    id: 'inline-code',
    icon: 'mdi-code-tags',
    tooltip: t('admin.blog.create.inlineCodeTooltip'),
    action: insertInlineCode,
    isActive: false,
  },
  {
    id: 'code-block',
    icon: 'mdi-code-block-tags',
    tooltip: t('admin.blog.create.codeBlockTooltip'),
    action: insertCodeBlock,
    isActive: false,
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
      checkBoldState()
      checkItalicState()
      checkUnderlineState()
    }
  }
}

function getTextareaElement() {
  // @ts-expect-error HTMLElement
  return textEditor.value?.$el?.querySelector('textarea')
}

function checkBoldState() {
  const content = blogContent.value
  const start = selectionStart.value

  let beforeBold = false
  let afterBold = false

  // Check for ** before cursor
  for (let i = start - 1; i >= 1; i--) {
    if (content.slice(i - 1, i + 1) === '**') {
      beforeBold = true
      break
    }
    if (content[i] === '\n')
      break
  }

  // Check for ** after cursor
  for (let i = start; i < content.length - 1; i++) {
    if (content.slice(i, i + 2) === '**') {
      afterBold = true
      break
    }
    if (content[i] === '\n')
      break
  }

  isBoldActive.value = beforeBold && afterBold
}

function checkItalicState() {
  const content = blogContent.value
  const start = selectionStart.value

  let beforeItalic = false
  let afterItalic = false

  // Check for * before cursor (but not **)
  for (let i = start - 1; i >= 0; i--) {
    if (content[i] === '*' && content[i - 1] !== '*' && content[i + 1] !== '*') {
      beforeItalic = true
      break
    }
    if (content[i] === '\n')
      break
  }

  // Check for * after cursor (but not **)
  for (let i = start; i < content.length; i++) {
    if (content[i] === '*' && content[i - 1] !== '*' && content[i + 1] !== '*') {
      afterItalic = true
      break
    }
    if (content[i] === '\n')
      break
  }

  isItalicActive.value = beforeItalic && afterItalic
}

function checkUnderlineState() {
  const content = blogContent.value
  const start = selectionStart.value

  let beforeUnderline = false
  let afterUnderline = false

  // Check for <u> before cursor
  for (let i = start - 1; i >= 2; i--) {
    if (content.slice(i - 2, i + 1) === '<u>') {
      beforeUnderline = true
      break
    }
    if (content[i] === '\n')
      break
  }

  // Check for </u> after cursor
  for (let i = start; i < content.length - 3; i++) {
    if (content.slice(i, i + 4) === '</u>') {
      afterUnderline = true
      break
    }
    if (content[i] === '\n')
      break
  }

  isUnderlineActive.value = beforeUnderline && afterUnderline
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

    // Check if cursor is between empty wrappers (e.g., **|**)
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
// FORMATTING ACTIONS
// ========================
function generateRandomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function insertHeader() {
  const randomId = generateRandomId()
  wrapSelectedText(`<h2 id="${randomId}">\n`, '\n</h2>')
}

function insertSubheader() {
  const randomId = generateRandomId()
  wrapSelectedText(`<h3 id="${randomId}">\n`, '\n</h3>')
}

function toggleBold() {
  wrapSelectedText('**')
}

function toggleItalic() {
  wrapSelectedText('*')
}

function toggleUnderline() {
  wrapSelectedText('<u>', '</u>')
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

function insertInlineCode() {
  wrapSelectedText('`')
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
      const mainNum = emptyNumberedMatch[1]
      const newBeforeText = lines.slice(0, -1).join('\n')
      const separator = newBeforeText
        ? '\n'
        : ''

      if (mainNum === '1') {
        // If it's 1., convert to 1.1.
        blogContent.value = `${newBeforeText}${separator}1.1. ${afterText}`

        nextTick(() => {
          textarea.focus()
          const newPosition = newBeforeText.length + separator.length + '1.1. '.length
          textarea.setSelectionRange(newPosition, newPosition)
        })
      }
      else {
        // If it's any other number (2., 3., etc.), convert to 1.1.
        blogContent.value = `${newBeforeText}${separator}1.1. ${afterText}`

        nextTick(() => {
          textarea.focus()
          const newPosition = newBeforeText.length + separator.length + '1.1. '.length
          textarea.setSelectionRange(newPosition, newPosition)
        })
      }

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

// ========================
// PREVIEW FUNCTIONALITY
// ========================
const contentBlocks = computed(() => {
  const content = blogContent.value
  const blocks: Array<{ type: string, content: string, title?: string }> = []

  // Split content by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g)

  parts.forEach((part) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // This is a code block
      const lines = part.slice(3, -3).split('\n')
      const firstLine = lines[0] || ''
      const title = firstLine.trim()
      const codeContent = lines.slice(title
        ? 1
        : 0).join('\n')

      blocks.push({
        type: 'code-block',
        title: title || undefined,
        content: codeContent,
      })
    }
    else if (part.trim()) {
      // Regular text content - process inline formatting
      const processedContent = part
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic text (single * but not part of **)
        .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
        // Underline text
        .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
        // Inline code - use proper regex to capture only content between backticks
        .replace(/`([^`]+)`/g, '|||INLINE_CODE_START|||$1|||INLINE_CODE_END|||')
        // Convert numbered sub-list items to HTML (must come before main numbered list)
        .replace(/^(\d+)\.(\d+)\. (.+)$/gm, '<li style="margin-left: 20px;">$3</li>')
        // Convert main numbered list items to HTML
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        // Convert bullet list items to HTML
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Wrap consecutive list items in <ol> or <ul> tags
        .replace(/(<li>.*<\/li>)(\n<li>.*<\/li>)*/g, (match) => {
          // Check if any line has indented items (sub-numbered lists)
          if (match.includes('margin-left: 20px')) {
            return `<ol>${match.replace(/\n/g, '')}</ol>`
          }
          // Check if it's a numbered list (original numbered items)
          else if (match.includes('<li>') && part.match(/^\d+\. /gm)) {
            return `<ol>${match.replace(/\n/g, '')}</ol>`
          }
          // Default to unordered list (bullet points)
          else {
            return `<ul>${match.replace(/\n/g, '')}</ul>`
          }
        })
        // Line breaks (after header processing)
        .replace(/\n/g, '<br>')

      blocks.push({
        type: 'text',
        content: processedContent,
      })
    }
  })

  return blocks
})

function togglePreviewMode() {
  isPreviewMode.value = !isPreviewMode.value
}

function copyText(text: string) {
  navigator.clipboard.writeText(text)
}

// ========================
// BLOG MANAGEMENT
// ========================
function clearContent() {
  blogContent.value = ''
}

function generateTableOfContents(content: string): ITableOfContentsItem[] {
  const tableOfContents: ITableOfContentsItem[] = []
  let currentHeaderLevel = 0
  let subHeaderCount = 0

  // Find all header and subheader tags - updated regex to handle multiline content
  const headerRegex = /<(header|subheader) id="([^"]+)"[^>]*>([^<]*(?:<(?!\/\1>)[^<]*)*)<\/\1>/g
  const matches = Array.from(content.matchAll(headerRegex))

  for (const match of matches) {
    const [, tagType, id, titleText] = match
    const cleanTitle = titleText.trim()

    if (tagType === 'header') {
      currentHeaderLevel++
      subHeaderCount = 0 // Reset subheader count for new header

      tableOfContents.push({
        title: { en: cleanTitle, pl: cleanTitle }, // Will be translated later
        id,
        mainLevel: currentHeaderLevel,
        subLevel: null,
      })
    }
    else if (tagType === 'subheader') {
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
  const translatedTitle = await translateText(trimmedTitle)
  const translatedContent = await translateText(blogContent.value)

  const tableOfContents = generateTableOfContents(blogContent.value)

  const translatedTableOfContents = await Promise.all(
    tableOfContents.map(async item => ({
      ...item,
      title: await translateText(item.title.en),
    })),
  )

  return mapIBlogEncoded({
    title: translatedTitle,
    value: translatedTitle.en.replace(/\s+/g, '-').toLowerCase(),
    content: translatedContent,
    isPublished,
    featured: isFeatured.value,
    category: category.value || 'other',
    author: userData.value?.reference || null,
    tableOfContents: translatedTableOfContents,
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

          <v-checkbox
            v-model="isFeatured"
            :label="$t('admin.blog.create.featuredCheckbox')"
            color="primary"
            class="ml-4"
          />
        </v-row>

        <v-toolbar
          density="compact"
          class="mb-2 mt-4"
        >
          <v-btn
            v-for="control in toolbarControls"
            :key="control.id"
            icon
            :color="control.isActive
              ? 'primary'
              : ''"
            size="small"
            class="mx-1"
            @click="control.action"
          >
            <v-icon>
              {{ control.icon }}
            </v-icon>

            <v-tooltip
              :text="control.tooltip"
              location="top"
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
              location="top"
              activator="parent"
            />
          </v-btn>
        </v-toolbar>

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

        <div v-else>
          <v-card
            class="pa-4"
          >
            <template
              v-for="(block, index) in contentBlocks"
              :key="index"
            >
              <!-- Code blocks -->
              <v-card
                v-if="block.type === 'code-block'"
                class="ma-2"
                color="surface-variant-light"
                max-width="1000"
              >
                <v-card-title
                  style="font-size: 0.9em;"
                  class="d-flex justify-space-between align-center"
                >
                  <div>
                    {{ block.title }}
                  </div>

                  <v-btn
                    icon="mdi-content-copy"
                    variant="text"
                    size="x-small"
                    rounded="circle"
                    @click="copyText(block.content)"
                  />
                </v-card-title>

                <v-divider v-if="block.title" />

                <v-card-text
                  class="pa-3"
                  style="white-space: pre-wrap;"
                >
                  {{ block.content }}
                </v-card-text>
              </v-card>

              <!-- Text content -->
              <div
                v-else-if="block.type === 'text'"
                class="mb-2"
              >
                <template
                  v-for="(part, partIndex) in block.content.split('|||INLINE_CODE_START|||')"
                  :key="partIndex"
                >
                  <template v-if="part.includes('|||INLINE_CODE_END|||')">
                    <template
                      v-for="(subPart, subIndex) in part.split('|||INLINE_CODE_END|||')"
                      :key="subIndex"
                    >
                      <v-card
                        v-if="subIndex === 0"
                        variant="flat"
                        density="compact"
                        color="surface-variant-light"
                        class="d-inline-block mx-1 px-2"
                        style="font-family: monospace; font-size: 0.9em; font-style: italic; width: fit-content;"
                      >
                        {{ subPart }}
                      </v-card>

                      <span
                        v-else
                        v-html="subPart"
                      />
                    </template>
                  </template>

                  <span
                    v-else
                    v-html="part"
                  />
                </template>
              </div>
            </template>
          </v-card>
        </div>
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
.v-text-field :deep(input) {
  font-size: 1.5em;
}

.blog-textarea :deep(textarea) {
  font-size: 1.2em !important;
  line-height: 1.5 !important;
}
</style>
