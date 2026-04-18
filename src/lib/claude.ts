// Claude API wrapper — routes through Supabase Edge Function (claude-proxy)
// to keep the API key server-side and avoid CORS issues.

import { supabase } from '@/lib/supabase'

interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

async function callClaude(messages: ClaudeMessage[], max_tokens = 2048): Promise<string> {
  const { data, error } = await supabase.functions.invoke('claude-proxy', {
    body: { messages, max_tokens },
  })

  if (error) throw new Error(`Edge Function error: ${error.message}`)
  if (data?.error) throw new Error(`Claude API error: ${data.error}`)

  const text: string = data?.content?.[0]?.text ?? ''
  if (!text) throw new Error('Empty response from Claude')
  return text
}

// Strips markdown code fences (```json ... ```) that Claude sometimes adds
function parseJSON<T>(text: string): T {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()
  return JSON.parse(cleaned) as T
}

export async function generateFlashcards(noteContent: string): Promise<Array<{ front: string; back: string }>> {
  const text = await callClaude([{
    role: 'user',
    content: `Create flashcards from the following note. Return a JSON array of objects with "front" and "back" keys only. No extra text, no markdown.\n\n${noteContent}`,
  }])
  try {
    return parseJSON(text)
  } catch {
    return []
  }
}

export async function generateQuizQuestions(
  content: string,
  count = 5,
): Promise<Array<{ question: string; correct_answer: string; options: string[]; type: string }>> {
  const text = await callClaude([{
    role: 'user',
    content: `Create ${count} multiple choice quiz questions from the following content. Return a JSON array with fields: "question", "correct_answer", "options" (array of 4 strings), "type" = "multiple_choice". No extra text, no markdown.\n\n${content}`,
  }])
  try {
    return parseJSON(text)
  } catch {
    return []
  }
}

export async function suggestSubjectsForProgram(studyProgram: string): Promise<string[]> {
  const text = await callClaude([{
    role: 'user',
    content: `List 8-10 typical subjects/courses for a student studying "${studyProgram}". Return a JSON array of strings only. No extra text, no markdown.`,
  }], 512)
  try {
    return parseJSON(text)
  } catch {
    return []
  }
}

export async function summarizeOnboardingSetup(profile: {
  name: string
  studyProgram: string
  semester: number
  subjects: string[]
  dailyGoalMin: number
}): Promise<string> {
  return callClaude([{
    role: 'user',
    content: `Write a short, warm, motivating welcome message (2-3 sentences) for a student named ${profile.name} who studies ${profile.studyProgram} (semester ${profile.semester}). They have set up ${profile.subjects.length} subjects and plan to study ${profile.dailyGoalMin} minutes per day. Make it personal and encouraging.`,
  }], 256)
}
