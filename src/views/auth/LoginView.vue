<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import KInput from '@/components/ui/KInput.vue'
import KButton from '@/components/ui/KButton.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')

async function submit() {
  await auth.login(email.value, password.value)
  if (!auth.error) router.push('/')
}
</script>

<template>
  <div class="min-h-dvh bg-bg flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-surface rounded-lg shadow-md p-8 flex flex-col gap-6">

      <div class="text-center">
        <p lang="ja" class="font-jp text-4xl text-jp">記飛</p>
        <p class="font-serif text-base font-semibold tracking-[0.2em] text-text-muted mt-1">KITOBI</p>
      </div>

      <div class="flex flex-col gap-2">
        <h1 class="font-serif text-xl font-semibold text-text">Anmelden</h1>
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
        <KInput
          v-model="password"
          label="Passwort"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
        />

        <p v-if="auth.error" class="text-sm font-sans text-danger">{{ auth.error }}</p>

        <KButton type="submit" :loading="auth.loading" :full="true" class="mt-1">
          Anmelden →
        </KButton>
      </form>

      <div class="flex flex-col items-center gap-1.5 text-sm font-sans text-text-muted">
        <RouterLink to="/auth/forgot" class="hover:text-text transition-colors">
          Passwort vergessen?
        </RouterLink>
        <span>
          Noch kein Konto?
          <RouterLink to="/auth/register" class="text-primary hover:text-primary-dark transition-colors">
            Jetzt registrieren
          </RouterLink>
        </span>
      </div>

    </div>
  </div>
</template>
