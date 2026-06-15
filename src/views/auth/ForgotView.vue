<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import KInput from '@/components/ui/KInput.vue'
import KButton from '@/components/ui/KButton.vue'

const auth = useAuthStore()
const email = ref('')
const done = ref(false)

async function submit() {
  await auth.resetPassword(email.value)
  if (!auth.error) done.value = true
}
</script>

<template>
  <div class="min-h-dvh bg-bg flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-surface rounded-lg shadow-md p-8 flex flex-col gap-6">

      <div class="text-center">
        <p lang="ja" class="font-jp text-4xl text-jp">記飛</p>
        <p class="font-serif text-base font-semibold tracking-[0.2em] text-text-muted mt-1">KITOBI</p>
      </div>

      <template v-if="!done">
        <div class="flex flex-col gap-2">
          <h1 class="font-serif text-xl font-semibold text-text">Passwort zurücksetzen</h1>
          <div class="h-px bg-border" />
        </div>

        <form @submit.prevent="submit" class="flex flex-col gap-4">
          <KInput
            v-model="email"
            label="E-Mail"
            type="email"
            placeholder="deine@email.de"
            autocomplete="email"
          />

          <p v-if="auth.error" class="text-sm font-sans text-danger">{{ auth.error }}</p>

          <KButton type="submit" :loading="auth.loading" :full="true" class="mt-1">
            Reset-Link senden →
          </KButton>
        </form>

        <p class="text-center text-sm font-sans text-text-muted">
          <RouterLink to="/auth/login" class="hover:text-text transition-colors">
            ← Zurück zum Login
          </RouterLink>
        </p>
      </template>

      <template v-else>
        <div class="flex flex-col items-center gap-3 text-center py-4">
          <p class="font-serif text-xl font-semibold text-text">E-Mail gesendet</p>
          <p class="font-sans text-sm text-text-muted leading-relaxed">
            Überprüfe dein Postfach. Der Link ist 24 Stunden gültig.
          </p>
          <RouterLink to="/auth/login" class="text-sm font-sans text-primary hover:text-primary-dark transition-colors mt-2">
            Zurück zum Login
          </RouterLink>
        </div>
      </template>

    </div>
  </div>
</template>
