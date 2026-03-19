import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

function getClient() {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing')
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY)
}

export async function embedText(input: string): Promise<number[]> {
  const client = getClient()
  // Embedding model (768 dims) for pgvector(768)
  const model = client.getGenerativeModel({ model: 'text-embedding-004' })
  const res = await model.embedContent(input)
  const values = res.embedding?.values
  if (!values || !Array.isArray(values)) throw new Error('Gemini embedding failed')
  return values
}

export async function generateWithFlash(prompt: string) {
  const client = getClient()
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const res = await model.generateContent(prompt)
  return res.response.text()
}

export async function generateWithPro(prompt: string) {
  const client = getClient()
  const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' })
  const res = await model.generateContent(prompt)
  return res.response.text()
}

export function renderTemplateVariables(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key) => vars[key] ?? '')
}

