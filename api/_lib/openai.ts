import OpenAI from 'openai'

let client: OpenAI | undefined

function getClient() {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return client
}

export interface RawAIField<T> {
  value: T | null
  confidence: number
}

export interface RawAIExtraction {
  species: RawAIField<string>
  estimatedSizeCm: RawAIField<number>
  lureName: RawAIField<string>
  lureTypeRaw: RawAIField<string>
  waterClarity: RawAIField<'CLAIRE' | 'TROUBLE' | 'BOUEUSE'>
  notes: string | null
}

const FIELD_SCHEMA = (valueType: 'string' | 'number', enumValues?: string[]) => ({
  type: 'object',
  properties: {
    value: enumValues
      ? { type: [valueType, 'null'], enum: [...enumValues, null] }
      : { type: [valueType, 'null'] },
    confidence: { type: 'number' },
  },
  required: ['value', 'confidence'],
  additionalProperties: false,
})

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    species: FIELD_SCHEMA('string'),
    estimatedSizeCm: FIELD_SCHEMA('number'),
    lureName: FIELD_SCHEMA('string'),
    lureTypeRaw: FIELD_SCHEMA('string'),
    waterClarity: FIELD_SCHEMA('string', ['CLAIRE', 'TROUBLE', 'BOUEUSE']),
    notes: { type: ['string', 'null'] },
  },
  required: ['species', 'estimatedSizeCm', 'lureName', 'lureTypeRaw', 'waterClarity', 'notes'],
  additionalProperties: false,
}

const SYSTEM_PROMPT = `Tu es un assistant qui analyse une prise de pêche à partir d'une photo et/ou d'une description texte.
Extrais uniquement les informations visibles sur la photo ou mentionnées dans le texte : espèce du poisson, taille estimée en centimètres, nom du leurre utilisé, type/catégorie du leurre, et clarté de l'eau (CLAIRE, TROUBLE ou BOUEUSE).
Pour chaque champ, donne une valeur "confidence" entre 0 et 1 reflétant ta certitude.
Si une information n'est pas déterminable avec confiance, retourne "value": null et une confidence basse plutôt que d'inventer une donnée.
Ne jamais halluciner une information qui n'est ni visible sur la photo ni mentionnée dans le texte.`

export interface AnalyzeInput {
  photoBase64?: string
  promptText?: string
}

export async function runFishCatchAnalysis({
  photoBase64,
  promptText,
}: AnalyzeInput): Promise<RawAIExtraction> {
  const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = []

  if (promptText) {
    content.push({ type: 'text', text: promptText })
  }
  if (photoBase64) {
    content.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${photoBase64}` },
    })
  }

  const completion = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'fish_catch_analysis', strict: true, schema: RESPONSE_SCHEMA },
    },
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error('Réponse vide du modèle IA')

  return JSON.parse(raw) as RawAIExtraction
}
