// Anthropic Claude API wrapper
// For production: proxy through Supabase Edge Function to keep key server-side

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
const MODEL = 'claude-sonnet-4-6'
const API_URL = 'https://api.anthropic.com/v1/messages'

interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>
}

async function callClaude(messages: ClaudeMessage[]): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages,
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data: ClaudeResponse = await response.json()
  return data.content[0]?.text ?? ''
}

export async function generateFlashcards(noteContent: string): Promise<Array<{ front: string; back: string }>> {
  const text = await callClaude([{
    role: 'user',
    content: `Create flashcards from the following note. Return a JSON array of objects with "front" and "back" keys only. No extra text.\n\n${noteContent}`,
  }])

  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}

export async function generateQuizQuestions(content: string, count = 5): Promise<Array<{ question: string; correct_answer: string; options: string[]; type: string }>> {
  const text = await callClaude([{
    role: 'user',
    content: `Create ${count} multiple choice quiz questions from the following content. Return a JSON array with fields: "question", "correct_answer", "options" (array of 4 strings), "type" = "multiple_choice". No extra text.\n\n${content}`,
  }])

  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}

export async function suggestSubjectsForProgram(studyProgram: string): Promise<string[]> {
  const text = await callClaude([{
    role: 'user',
    content: `List 8-10 typical subjects/courses for a student studying "${studyProgram}". Return a JSON array of strings only. No extra text.`,
  }])

  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}

export async function summarizeOnboardingSetup(profile: { name: string; studyProgram: string; semester: number; subjects: string[]; dailyGoalMin: number }): Promise<string> {
  return callClaude([{
    role: 'user',
    content: `Write a short, warm, motivating welcome message (2-3 sentences) for a student named ${profile.name} who studies ${profile.studyProgram} (semester ${profile.semester}). They have set up ${profile.subjects.length} subjects and plan to study ${profile.dailyGoalMin} minutes per day. Make it personal and encouraging.`,
  }])
}
