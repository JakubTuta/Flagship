import { GoogleGenAI, Type } from '@google/genai'
import type { ITranslatedText } from '~/models/translatedText'

// Encode whitespace characters to preserve them
export function encodeWhitespace(text: string): string {
  return text
    .replace(/\n/g, '|||NEWLINE|||')
    .replace(/\t/g, '|||TAB|||')
    .replace(/\r/g, '|||CARRIAGE_RETURN|||')
    .replace(/ {2,}/g, match => `|||SPACES_${match.length}|||`)
}

// Decode whitespace characters back to original
export function decodeWhitespace(text: string): string {
  return text
    .replace(/\|\|\|NEWLINE\|\|\|/g, '\n')
    .replace(/\|\|\|TAB\|\|\|/g, '\t')
    .replace(/\|\|\|CARRIAGE_RETURN\|\|\|/g, '\r')
    .replace(/\|\|\|SPACES_(\d+)\|\|\|/g, (match, count) => ' '.repeat(Number.parseInt(count)))
}

function getTemplate(text: string, textLanguage: 'pl' | 'en' | null) {
  if (textLanguage === 'pl') {
    return `You are a translation assistant. Translate the given Polish text to English.

CRITICAL RULES:
- Do NOT translate any code between triple backticks (\`\`\`) or single backticks (\`)
- Keep all code blocks exactly as they are
- PRESERVE ALL ENCODED WHITESPACE: Text contains encoded whitespace markers like |||NEWLINE|||, |||TAB|||, |||SPACES_X||| - keep these EXACTLY as they are
- PRESERVE ALL HTML FORMATTING: Keep <strong>, <em>, <u> and other HTML tags exactly as they are
- Only translate the actual text content, not the formatting or whitespace markers
- Return the result in this exact JSON format: {"en": "english translation"}
- Maintain the exact same structure and all encoded whitespace markers
- Do NOT change the text in any way other than translating the readable content
- Do NOT add any additional explanations or comments
- Do NOT translate file paths, URLs, or code snippets

The text contains encoded whitespace markers that must be preserved exactly. Only translate the readable text content.

Text to translate:
${text}

Return JSON with preserved whitespace encoding:
{
    "en": "english translation with all |||MARKERS||| preserved"
}
`
  }

  if (textLanguage === 'en') {
    return `You are a translation assistant. Translate the given English text to Polish.

CRITICAL RULES:
- Do NOT translate any code between triple backticks (\`\`\`) or single backticks (\`)
- Keep all code blocks exactly as they are
- PRESERVE ALL ENCODED WHITESPACE: Text contains encoded whitespace markers like |||NEWLINE|||, |||TAB|||, |||SPACES_X||| - keep these EXACTLY as they are
- PRESERVE ALL HTML FORMATTING: Keep <strong>, <em>, <u> and other HTML tags exactly as they are
- Only translate the actual text content, not the formatting or whitespace markers
- Return the result in this exact JSON format: {"pl": "polish translation"}
- Maintain the exact same structure and all encoded whitespace markers
- Do NOT change the text in any way other than translating the readable content
- Do NOT add any additional explanations or comments
- Do NOT translate file paths, URLs, or code snippets

The text contains encoded whitespace markers that must be preserved exactly. Only translate the readable text content.

Text to translate:
${text}

Return JSON with preserved whitespace encoding:
{
    "pl": "polish translation with all |||MARKERS||| preserved"
}
`
  }

  // Default case: translate to both languages (textLanguage === null)
  return `You are a translation assistant. Translate the given text to English and Polish only.

CRITICAL RULES:
- Do NOT translate any code between triple backticks (\`\`\`) or single backticks (\`)
- Keep all code blocks exactly as they are
- PRESERVE ALL ENCODED WHITESPACE: Text contains encoded whitespace markers like |||NEWLINE|||, |||TAB|||, |||SPACES_X||| - keep these EXACTLY as they are
- PRESERVE ALL HTML FORMATTING: Keep <strong>, <em>, <u> and other HTML tags exactly as they are
- Only translate the actual text content, not the formatting or whitespace markers
- Return the result in this exact JSON format: {"en": "english translation", "pl": "polish translation"}
- If the text is already in English or Polish, still provide both translations
- Maintain the exact same structure and all encoded whitespace markers
- Do NOT change the text in any way other than translating the readable content
- Do NOT add any additional explanations or comments
- Do NOT translate file paths, URLs, or code snippets

The text contains encoded whitespace markers that must be preserved exactly. Only translate the readable text content.

Text to translate:
${text}

Return JSON with preserved whitespace encoding:
{
    "en": "english translation with all |||MARKERS||| preserved",
    "pl": "polish translation with all |||MARKERS||| preserved"
}
`
}

export async function translateText(text: string | null, textLanguage: 'pl' | 'en' | null): Promise<ITranslatedText> {
  if (!text)
    return { pl: '', en: '' }

  const config = useRuntimeConfig()
  const apiKey = config.public.GEMINI_API_KEY

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in the environment variables.')

    return { pl: text, en: text }
  }

  try {
    // Encode whitespace before sending to AI
    const encodedText = encodeWhitespace(text)

    const ai = new GoogleGenAI({ apiKey })

    // Determine response schema based on textLanguage
    let responseSchema
    if (textLanguage === 'pl') {
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          en: {
            type: Type.STRING,
          },
        },
        propertyOrdering: ['en'],
      }
    }
    else if (textLanguage === 'en') {
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          pl: {
            type: Type.STRING,
          },
        },
        propertyOrdering: ['pl'],
      }
    }
    else {
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          en: {
            type: Type.STRING,
          },
          pl: {
            type: Type.STRING,
          },
        },
        propertyOrdering: ['en', 'pl'],
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: getTemplate(encodedText, textLanguage),
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    })

    if (!response || !response.text) {
      console.error('No response text received from the translation API.')

      return { pl: text, en: text }
    }

    const result = JSON.parse(response.text) as Partial<ITranslatedText>

    // Handle different response formats based on textLanguage
    if (textLanguage === 'pl') {
      return {
        en: result.en
          ? decodeWhitespace(result.en)
          : text,
        pl: text, // Keep original Polish text
      }
    }
    else if (textLanguage === 'en') {
      return {
        en: text, // Keep original English text
        pl: result.pl
          ? decodeWhitespace(result.pl)
          : text,
      }
    }
    else {
      // Decode whitespace back to original characters for both languages
      return {
        en: result.en
          ? decodeWhitespace(result.en)
          : text,
        pl: result.pl
          ? decodeWhitespace(result.pl)
          : text,
      }
    }
  }
  catch (error) {
    console.error('Error translating text:', error)

    return { pl: text, en: text }
  }
}
