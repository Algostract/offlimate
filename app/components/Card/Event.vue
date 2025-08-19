<script setup lang="ts">
import { parseISO, format, formatDistanceToNow, isBefore, startOfDay } from 'date-fns'

const props = defineProps<{
  name: string
  address: string
  image: string
  datetime: string
  price: number
  paymentUrl: string
  directionUrl: string
  callUrl: string
}>()

const dateObj = computed(() => parseISO(props.datetime))
// formatted parts
const date = computed(() => format(dateObj.value, 'MMMM d, yyyy')) // Aug 24, 2025
const day = computed(() => format(dateObj.value, 'EEEE')) // Sunday
const time = computed(() => format(dateObj.value, 'hh:mm a')) // 08:00 PM
const relativeTime = computed(() => formatDistanceToNow(dateObj.value, { addSuffix: true }))
const isActive = computed(() => {
  const now = new Date()
  // active only if current time is strictly before the event day
  return isBefore(now, startOfDay(dateObj.value))
})
</script>

<template>
  <div class="relative space-y-4">
    <!-- Date -->
    <div class="flex items-center justify-between text-white">
      <span class="font-medium">
        {{ date }} <span class="ml-1 opacity-60">{{ day }}</span>
      </span>
      <span class="">{{ relativeTime }}</span>
    </div>
    <!-- Card -->
    <div
      class="relative grid aspect-[5/3] max-w-md grid-cols-[repeat(2,1fr)] grid-rows-[repeat(4,auto)_fit-content] gap-2 rounded-xl border border-dark-600 bg-dark-500 pb-4 pl-4 text-white shadow-md">
      <NuxtImg :src="image" alt="event" height="384" width="384" class="col-span-1 col-start-2 row-span-4 row-start-1 aspect-square rounded-bl-lg object-cover" />
      <!-- Left info -->
      <p class="col-start-1 row-start-1 mt-4 text-sm opacity-60">{{ time }}</p>
      <!-- <div class="flex-1 space-y-1"> -->
      <h3 class="font-semibold col-start-1 row-start-2 text-base">{{ name }}</h3>
      <p class="col-start-1 row-start-3 text-sm leading-snug opacity-60">
        {{ address }}
      </p>
      <!-- </div> -->
      <p class="font-semibold col-start-1 row-start-4 pt-1 text-base">₹{{ price }}</p>
      <!-- Actions -->
      <div v-show="isActive" class="col-span-full col-start-1 row-start-5 flex gap-2 pt-2">
        <NuxtLink :to="paymentUrl" external class="font-medium text-gray-900 flex h-fit items-center gap-1 rounded-full bg-white px-2 py-1.5 pr-3 text-sm text-black shadow">
          <NuxtIcon name="local:ticket" class="text-[16px]" /> Purchase
        </NuxtLink>
        <NuxtLink :to="directionUrl" external target="_blank" class="font-medium text-gray-900 flex h-fit items-center gap-1 rounded-full bg-white px-2 py-1.5 pr-3 text-sm text-black shadow">
          <NuxtIcon name="local:geo" class="text-[16px]" /> Direction
        </NuxtLink>
        <NuxtLink :to="callUrl" external class="font-medium text-gray-900 flex h-fit items-center gap-1 rounded-full bg-white px-2 py-1.5 pr-3 text-sm text-black shadow">
          <NuxtIcon name="local:call-accept" class="text-[16px]" /> Ask
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
