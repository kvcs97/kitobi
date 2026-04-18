import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import type { Database } from '@/types/database.types'

type Note = Database['public']['Tables']['notes']['Row']

export function useNotes(subjectId?: string | null) {
  const { user } = useAuthStore()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['notes', user?.id, subjectId],
    queryFn: async () => {
      let q = supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })

      if (subjectId) q = q.eq('subject_id', subjectId)

      const { data, error } = await q
      if (error) throw error
      return data as Note[]
    },
    enabled: !!user,
  })

  const create = useMutation({
    mutationFn: async (values: { title?: string; subject_id?: string | null }) => {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user!.id,
          title: values.title ?? 'Neue Notiz',
          subject_id: values.subject_id ?? null,
        })
        .select()
        .single()
      if (error) throw error
      return data as Note
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })

  const update = useMutation({
    mutationFn: async (values: { id: string; title?: string; content?: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...(values.title !== undefined && { title: values.title }),
          ...(values.content !== undefined && { content: values.content }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', values.id)
        .select()
        .single()
      if (error) throw error
      return data as Note
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })

  return { ...query, create, remove, update }
}
