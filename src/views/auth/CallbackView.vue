<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

onMounted(async () => {
  // PKCE flow: Supabase sendet ?code= im Query-String
  const code = new URLSearchParams(window.location.search).get('code')
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Fallback: Tokens im URL-Hash (älteres Implicit Flow)
  const hash = window.location.hash.replace(/^#\/?auth\/callback/, '')
  if (hash.includes('access_token')) {
    const params = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    if (accessToken && refreshToken) {
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
    }
  }

  const { data: { session } } = await supabase.auth.getSession()
  router.replace(session ? '/' : '/auth/login')
})
</script>

<template>
  <div class="min-h-dvh bg-bg flex items-center justify-center">
    <p lang="ja" class="font-jp text-5xl text-jp animate-pulse">記飛</p>
  </div>
</template>
