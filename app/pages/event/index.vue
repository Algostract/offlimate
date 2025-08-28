<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['auth'],
})

const { data: events } = await useFetch('/api/event')
</script>

<template>
  <main class="flex min-h-screen w-screen flex-col gap-8 p-5">
    <CardEvent
      v-for="{ id, datetime, location, image, urls } in events"
      :id="id"
      :key="id"
      :datetime="datetime"
      :name="location.name"
      :address="location.address"
      :image="image"
      :direction-url="urls.direction"
      :call-url="urls.call" />
  </main>
</template>
