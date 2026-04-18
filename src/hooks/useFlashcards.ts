import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import type { Database } from '@/types/database.types'

type Deck = Database['public']['Tables']['flashcard_decks']['Row']
type Card = Database['public']['Tables']['flashcards']['Row']

// ── Decks ─────────────────────────────────────────────────────────────────────

export function useDecks() {
  const { user } = useAuthStore()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['decks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Deck[]
    },
    enabled: !!user,
  })

  const create = useMutation({
    mutationFn: async (values: { name: string; subject_id?: string | null }) => {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .insert({ user_id: user!.id, name: values.name, subject_id: values.subject_id ?? null })
        .select()
        .single()
      if (error) throw error
      return data as Deck
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['decks'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('flashcard_decks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['decks'] }),
  })

  return { ...query, create, remove }
}

// ── Deck stats (due counts per deck) ──────────────────────────────────────────

export function useDeckStats() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['deck-stats', user?.id],
    queryFn: async () => {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('flashcards')
        .select('deck_id, due_date')
      if (error) throw error

      const total: Record<string, number> = {}
      const due: Record<string, number> = {}
      for (const card of data) {
        total[card.deck_id] = (total[card.deck_id] ?? 0) + 1
        if (card.due_date <= now) {
          due[card.deck_id] = (due[card.deck_id] ?? 0) + 1
        }
      }
      return { total, due }
    },
    enabled: !!user,
  })
}

// ── Cards within a deck ───────────────────────────────────────────────────────

export function useCards(deckId?: string) {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['cards', deckId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('deck_id', deckId!)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Card[]
    },
    enabled: !!deckId,
  })

  const create = useMutation({
    mutationFn: async (values: { front: string; back: string }) => {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          deck_id: deckId!,
          front: values.front,
          back: values.back,
          due_date: new Date().toISOString(),
          stability: 0,
          difficulty: 0,
          state: 0,
          reps: 0,
          lapses: 0,
        })
        .select()
        .single()
      if (error) throw error
      return data as Card
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cards', deckId] })
      qc.invalidateQueries({ queryKey: ['deck-stats'] })
    },
  })

  const update = useMutation({
    mutationFn: async (values: { id: string; front: string; back: string }) => {
      const { data, error } = await supabase
        .from('flashcards')
        .update({ front: values.front, back: values.back })
        .eq('id', values.id)
        .select()
        .single()
      if (error) throw error
      return data as Card
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards', deckId] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('flashcards').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cards', deckId] })
      qc.invalidateQueries({ queryKey: ['deck-stats'] })
    },
  })

  return { ...query, create, update, remove }
}
