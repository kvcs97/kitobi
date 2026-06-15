import vocabularyN5 from '@/data/vocabulary-n5.json'

export interface VocabWord {
  id: string
  kanji: string
  hiragana: string
  romaji: string
  meaning: string
  pos: string
  level: string
  example_jp: string
  example_romaji: string
  example_de: string
}

export const allWords = vocabularyN5 as VocabWord[]

export function getWordById(id: string): VocabWord | undefined {
  return allWords.find(w => w.id === id)
}

export function getWordsByIds(ids: string[]): VocabWord[] {
  return ids.map(id => allWords.find(w => w.id === id)).filter(Boolean) as VocabWord[]
}
