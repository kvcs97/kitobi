import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  let initialized = false

  async function init() {
    if (initialized) return
    initialized = true
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) error.value = err.message
    loading.value = false
  }

  async function register(email: string, password: string) {
    loading.value = true
    error.value = null
    const { error: err } = await supabase.auth.signUp({ email, password })
    if (err) error.value = err.message
    loading.value = false
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    session.value = null
    initialized = false
  }

  async function resetPassword(email: string) {
    loading.value = true
    error.value = null
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/auth/callback`,
    })
    if (err) error.value = err.message
    loading.value = false
  }

  supabase.auth.onAuthStateChange((_event, s) => {
    session.value = s
    user.value = s?.user ?? null
  })

  return { user, session, loading, error, init, login, register, logout, resetPassword }
})
