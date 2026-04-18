import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  initialized: boolean
  onboardingCompleted: boolean | null  // null = not yet fetched
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setInitialized: (initialized: boolean) => void
  setOnboardingCompleted: (value: boolean) => void
  fetchProfile: (userId: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  initialized: false,
  onboardingCompleted: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setInitialized: (initialized) => set({ initialized }),
  setOnboardingCompleted: (value) => set({ onboardingCompleted: value }),
  fetchProfile: async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    set({ onboardingCompleted: data?.onboarding_completed ?? false })
  },
}))

// Bootstrap: load existing session + subscribe to auth changes.
// Called once in main.tsx at startup.
export function initAuth() {
  supabase.auth.getSession().then(async ({ data }) => {
    const store = useAuthStore.getState()
    store.setSession(data.session)
    if (data.session?.user) {
      await store.fetchProfile(data.session.user.id)
    } else {
      store.setOnboardingCompleted(false)
    }
    store.setInitialized(true)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
    const store = useAuthStore.getState()
    store.setSession(session)
    if (session?.user) {
      await store.fetchProfile(session.user.id)
    } else {
      store.setOnboardingCompleted(false)
    }
  })

  return () => subscription.unsubscribe()
}
