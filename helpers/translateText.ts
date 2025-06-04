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

function getTemplate(text: string) {
  return `You are a translation assistant. Translate the given text to English and Polish only.

CRITICAL FORMATTING RULES:
- Do NOT translate any code between triple backticks (\`\`\`) or single backticks (\`)
- Keep all code blocks exactly as they are
- PRESERVE ALL ENCODED WHITESPACE: Text contains encoded whitespace markers like |||NEWLINE|||, |||TAB|||, |||SPACES_X||| - keep these EXACTLY as they are
- PRESERVE ALL MARKDOWN FORMATTING: Keep **bold**, *italic*, <u>underline</u>, and other formatting markers exactly as they are
- Only translate the actual text content, not the formatting or whitespace markers
- Return the result in this exact JSON format: {"en": "english translation", "pl": "polish translation"}
- If the text is already in English or Polish, still provide both translations
- Maintain the exact same structure and all encoded whitespace markers

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

export async function translateText(text: string | null): Promise<ITranslatedText> {
  if (!text)
    return { pl: '', en: '' }

  const config = useRuntimeConfig()
  const apiKey = config.public.GEMINI_API_KEY

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in the environment variables.')

    return { pl: '', en: '' }
  }

  try {
    // Encode whitespace before sending to AI
    const encodedText = encodeWhitespace(text)

    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: getTemplate(encodedText),
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
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
        },
      },
    })

    if (!response || !response.text) {
      console.error('No response text received from the translation API.')

      return { pl: '', en: '' }
    }

    const result = JSON.parse(response.text) as ITranslatedText

    // Decode whitespace back to original characters
    return {
      en: decodeWhitespace(result.en),
      pl: decodeWhitespace(result.pl),
    }
  }
  catch (error) {
    console.error('Error translating text:', error)

    return { pl: '', en: '' }
  }
}
