<script setup lang="ts">
defineProps<{
  title: string
  to: string
}>()
</script>

<template>
  <NuxtLink :to="to" class="relative flex items-center justify-center gap-1.5 rounded-lg bg-white px-5 py-2 text-base font-semi-bold text-black">
    {{ title }}
  </NuxtLink>
</template>
