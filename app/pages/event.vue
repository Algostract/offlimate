<script lang="ts" setup>
definePageMeta({
  layout: false,
})

const { data: events } = await useFetch('/api/event')
</script>

<template>
  <main class="flex min-h-screen w-screen flex-col gap-8 p-5">
    <CardEvent
      v-for="{ id, datetime, location, price, image, urls } in events"
      :key="id"
      :datetime="datetime"
      :name="location.name"
      :address="location.address"
      :price="price"
      :image="image"
      :payment-url="urls.payment"
      :direction-url="urls.direction"
      :call-url="urls.call" />
  </main>
</template>
