import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import type { Database } from '@/types/database.types'

type Subject = Database['public']['Tables']['subjects']['Row']
type SubjectInsert = Database['public']['Tables']['subjects']['Insert']

export function useSubjects() {
  const { user } = useAuthStore()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['subjects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Subject[]
    },
    enabled: !!user,
  })

  const create = useMutation({
    mutationFn: async (values: { name: string; color: string }) => {
      const { data, error } = await supabase
        .from('subjects')
        .insert({ user_id: user!.id, ...values } satisfies SubjectInsert)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...values }: { id: string; name?: string; color?: string; exam_date?: string | null }) => {
      const { error } = await supabase
        .from('subjects')
        .update(values)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }),
  })

  return { ...query, create, update, remove }
}
