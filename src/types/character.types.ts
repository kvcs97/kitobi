export interface Character {
  id: string
  char: string
  romaji: string
  type: 'hiragana' | 'katakana' | 'kanji'
  row?: string
  meaning?: string
}
