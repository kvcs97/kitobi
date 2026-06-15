<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import KInput from '@/components/ui/KInput.vue'
import KButton from '@/components/ui/KButton.vue'

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const confirmError = ref('')
const done = ref(false)

async function submit() {
  confirmError.value = ''
  if (password.value !== passwordConfirm.value) {
    confirmError.value = 'Passwörter stimmen nicht überein.'
    return
  }
  await auth.register(email.value, password.value)
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
          <h1 class="font-serif text-xl font-semibold text-text">Konto erstellen</h1>
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
            autocomplete="new-password"
          />
          <KInput
            v-model="passwordConfirm"
            label="Passwort bestätigen"
            type="password"
            placeholder="••••••••"
            :error="confirmError"
            autocomplete="new-password"
          />

          <p v-if="auth.error" class="text-sm font-sans text-danger">{{ auth.error }}</p>

          <KButton type="submit" :loading="auth.loading" :full="true" class="mt-1">
            Registrieren →
          </KButton>
        </form>

        <p class="text-center text-sm font-sans text-text-muted">
          Bereits ein Konto?
          <RouterLink to="/auth/login" class="text-primary hover:text-primary-dark transition-colors">
            Anmelden
          </RouterLink>
        </p>
      </template>

      <template v-else>
        <div class="flex flex-col items-center gap-3 text-center py-4">
          <p class="font-serif text-xl font-semibold text-text">Bestätigungsmail gesendet</p>
          <p class="font-sans text-sm text-text-muted leading-relaxed">
            Bitte überprüfe dein Postfach und klicke auf den Link, um dein Konto zu aktivieren.
          </p>
          <RouterLink to="/auth/login" class="text-sm font-sans text-primary hover:text-primary-dark transition-colors mt-2">
            Zurück zum Login
          </RouterLink>
        </div>
      </template>

    </div>
  </div>
</template>
