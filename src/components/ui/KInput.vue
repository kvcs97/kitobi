<script setup lang="ts">
defineProps<{
  label: string
  type?: string
  placeholder?: string
  error?: string
  modelValue: string
  autocomplete?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-sm font-sans text-text-muted">{{ label }}</label>
    <input
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      :autocomplete="autocomplete"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full px-3 py-2.5 bg-surface border border-border rounded-md font-sans text-sm text-text placeholder-text-muted outline-none focus:border-primary transition-colors"
      :class="{ 'border-danger focus:border-danger': error }"
    />
    <span v-if="error" class="text-xs font-sans text-danger">{{ error }}</span>
  </div>
</template>
