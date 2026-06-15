<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <svg
    :width="size === 'lg' ? 48 : size === 'sm' ? 26 : 34"
    :height="size === 'lg' ? 48 : size === 'sm' ? 26 : 34"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="KITOBI"
    role="img"
  >
    <!-- Sakura Pink rounded square -->
    <rect width="40" height="40" rx="10" fill="#C4848A"/>
    <!-- 記 — Noto Serif JP is loaded globally, so SVG text inherits it -->
    <text
      x="20"
      y="29"
      text-anchor="middle"
      font-family="'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', serif"
      font-size="23"
      font-weight="400"
      fill="white"
    >記</text>
  </svg>
</template>
