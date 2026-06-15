export interface Word {
  id: string
  kanji: string
  hiragana: string
  romaji: string
  meaning: string
  pos: string
  example_jp: string
  example_romaji: string
  example_de: string
  level: 'n5' | 'n4'
}
