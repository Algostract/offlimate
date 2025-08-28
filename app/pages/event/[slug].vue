<script setup lang="ts">
import { domToJpeg } from 'modern-screenshot'

definePageMeta({
  layout: false,
  middleware: ['auth'],
})

const {
  public: { siteUrl },
} = useRuntimeConfig()

const route = useRoute()
const slug = route.params.slug

const { data: ticket, refresh } = await useFetch(`/api/event/${slug}`)

const ticketType = ref<'basic' | 'vip'>(ticket.value?.type ?? 'basic')

const { execute, status } = await useFetch(`/api/event/${slug}`, {
  method: 'POST',
  body: {
    ticketType,
  },
  immediate: false,
  watch: false,
})

async function onGetTicket() {
  await execute()
  await refresh()
}

const isSharing = ref(false)
const isDownloading = ref(false)

async function exportTicket(): Promise<string> {
  const el = document.querySelector('#ticket') as HTMLElement
  if (!el) return

  // get element size
  const rect = el.getBoundingClientRect()
  const aspect = rect.width / rect.height

  const targetHeight = 1080
  const targetWidth = Math.round(targetHeight * aspect)

  const imageUri = await domToJpeg(el, {
    width: targetWidth,
    height: targetHeight,
    style: {
      transform: `scale(${targetWidth / rect.width})`,
      transformOrigin: 'top left',
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    },
  })

  return imageUri // base64 data URI (JPEG)
}

async function shareTicket() {
  if (!ticket.value?.qr) return

  isSharing.value = true
  const imageUri = await exportTicket()
  await share({
    name: ticket.value.name,
    imageUrl: imageUri,
    url: `${siteUrl}/event/${slug}`,
  })
  isSharing.value = false
}

async function downloadTicket() {
  if (!ticket.value?.qr) return

  isDownloading.value = true
  const imageUri = await exportTicket()
  const link = document.createElement('a')
  link.href = imageUri
  link.download = `${ticket.value.name}.jpg`
  link.click()
  URL.revokeObjectURL(link.href)
  isDownloading.value = false
}

const qrImage = computed(() => (ticket.value?.qr ? `data:image/svg+xml;utf8,${encodeURIComponent(ticket.value.qr)}` : 'https://api.dicebear.com/9.x/glass/svg'))
</script>

<template>
  <main class="flex min-h-screen w-full items-center justify-center p-5">
    <section id="ticket" class="flex w-full max-w-2xl flex-col gap-6 rounded-2xl bg-dark-500 p-6 shadow-xl ring-1 ring-dark-600">
      <template v-if="!ticket">
        <header>
          <h1 id="signup-heading" class="text-xl text-white">Choose Ticket</h1>
          <p class="mt-1 text-light-600">Choose from normal or vip</p>
        </header>
        <!-- Toggle buttons -->
        <div role="tablist" aria-label="Ticket type" class="relative isolate flex items-center justify-between rounded-full bg-[#0b0f14] p-1">
          <span
            aria-hidden="true"
            class="absolute bottom-1 top-1 -z-10 w-[calc(50%-4px)] rounded-full bg-primary-500 shadow-md transition-all duration-200"
            :class="ticketType === 'basic' ? 'translate-x-0' : 'translate-x-full'" />
          <button
            role="tab"
            :aria-selected="ticketType === 'basic'"
            class="font-semibold relative flex w-1/2 flex-col items-center justify-center gap-1 rounded-full px-5 py-2 text-base transition-transform duration-150"
            :class="ticketType === 'basic' ? 'text-black' : 'text-white'"
            @click="ticketType = 'basic'">
            <span>
              <NuxtIcon name="local:symbol" class="inline-block text-[24px]" />
              Basic
            </span>
            <span class="block">(₹{{ ticketPriceMap['basic'] }})</span>
          </button>
          <button
            role="tab"
            :aria-selected="ticketType === 'vip'"
            class="font-semibold relative flex w-1/2 flex-col items-center justify-center gap-1 rounded-full px-5 py-2 text-base transition-transform duration-150"
            :class="ticketType === 'vip' ? 'text-black' : 'text-white'"
            @click="ticketType = 'vip'">
            <span> <NuxtIcon name="local:star" class="inline-block text-[24px]" /> VIP </span>
            <span class="block">(₹{{ ticketPriceMap['vip'] }})</span>
          </button>
        </div>
        <!-- Submit button -->
        <button
          class="font-medium flex w-full items-center justify-center gap-1.5 rounded-lg py-3 text-base transition-all disabled:cursor-not-allowed disabled:opacity-60"
          :class="!!ticketType ? 'bg-white text-black' : 'bg-black text-white'"
          @click="onGetTicket">
          <NuxtIcon v-if="status === 'pending'" name="local:loader" class="text-[24px]" />Get Ticket
        </button>
      </template>
      <template v-else>
        <div class="flex w-full max-w-sm flex-col items-center gap-4">
          <!-- Title -->
          <h1 class="text-lg font-light">{{ ticket.name }}</h1>
          <!-- Inner dark panel -->
          <div class="flex w-fit flex-col items-center justify-center gap-4 rounded-3xl bg-dark-400 p-4">
            <!-- QR area -->
            <div class="flex items-center justify-center rounded-[18px] bg-dark-500 p-2">
              <img :src="qrImage" alt="QR" class="size-[192px] rounded-md object-cover" />
            </div>
            <div class="flex w-full items-center justify-between">
              <span class="text-sm capitalize"> {{ ticket.type }} - {{ ticket.price ?? '—' }} </span>
              <strong
                class="font-medium inline-flex items-center rounded-full px-3 py-1 text-sm capitalize"
                :class="{
                  'bg-primary-400 text-black': ticket.status === 'booked',
                  'bg-primary-500 text-white': ticket.status === 'confirmed',
                  'bg-success-500 text-white': ticket.status === 'paid',
                  'bg-alert-500 text-white': ticket.status === 'cancelled',
                }">
                {{ ticket.status }}
              </strong>
            </div>
          </div>
          <!-- action buttons -->
          <div class="flex w-full items-center justify-between gap-3 rounded-2xl p-6">
            <button
              :disabled="isSharing"
              class="font-medium text-gray-900 flex h-fit grow items-center justify-center gap-1 rounded-full bg-white fill-black px-2 py-1.5 pr-3 text-sm text-black shadow"
              @click="shareTicket">
              <NuxtIcon name="local:share" class="text-[16px]" /> Share
            </button>
            <button
              :disabled="isDownloading"
              class="font-medium text-gray-900 flex h-fit grow items-center justify-center gap-1 rounded-full bg-white fill-black px-2 py-1.5 pr-3 text-sm text-black shadow"
              @click="downloadTicket">
              <NuxtIcon name="local:download" class="text-[16px]" /> Download
            </button>
          </div>
          <p class="text-center text-sm">Scan to pay with any UPI app</p>
        </div>
      </template>
    </section>
  </main>
</template>
