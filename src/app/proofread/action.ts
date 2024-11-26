'use server'

import { HfInference } from '@huggingface/inference'
import OpenAI from 'openai'
import { z } from 'zod'

// Input validation schema
const ProofreadSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text is too long'),
  tone: z.string().min(1, 'Tone is required'),
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function proofreadText(text: string, tone: string): Promise<string> {
  const validationResult = ProofreadSchema.safeParse({ text, tone })

  if (!validationResult.success) {
    throw new Error(validationResult.error.errors[0].message)
  }

  try {
    const prompt = `
      Tasks:
      1. Correct grammar and spelling
      2. Enhance clarity
      3. Rewrite in a ${tone} tone
      
      Original Text: ${text}
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    })

    const proofreadText = response.choices[0].message.content || 'No output generated'

    return proofreadText
  } catch (error) {
    console.error('Proofreading Error:', error)
    throw new Error('Failed to process text')
  }
}

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY)

export async function proofreadTextHuggingFace(text: string, tone: string): Promise<string> {
  const validationResult = ProofreadSchema.safeParse({ text, tone })

  if (!validationResult.success) {
    throw new Error(validationResult.error.errors[0].message)
  }

  try {
    const prompt = `
        You are a text-proofreading assistant. Your task is to:
        - Correct grammar and spelling errors.
        - Enhance clarity and readability.
        - Rewrite the text to match a "${tone}" tone.
        - If the input is invalid or nonsensical, respond with exactly: "Invalid input. Please provide meaningful text."
        - Output only the revised text, without adding any explanations, notes, or additional sentences like "Please let me know."
        - Do not include the original text or instructions in the response.

        Input:
        "${text}"
        Output:
`

    const response = await hf.textGeneration({
      model: 'google/gemma-2-2b-it',
      // model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
      },
    })
    let revisedText = response.generated_text.trim().split('Output:')[1]?.trim()
    console.log(revisedText)
    revisedText = revisedText?.replace(/"/g, '').trim()
    return revisedText
  } catch (error) {
    console.error('Proofread Error:', error)
    throw new Error('Failed to process text')
  }
}
