<template>
  <footer class="text-gray-300 w-full px-6 py-6">
    <div class="flex items-start justify-between">
      <!-- Left Section -->
      <div>
        <h2 class="font-medium text-lg text-white">Offlimate</h2>
        <div class="mt-2 flex gap-4 text-sm">
          <NuxtLink to="#" class="opacity-80 hover:opacity-100">Terms</NuxtLink>
          <NuxtLink to="#" class="opacity-80 hover:opacity-100">Privacy</NuxtLink>
        </div>
      </div>
      <!-- Center Logo -->
      <div class="absolute left-1/2 -translate-x-1/2 -translate-y-8 transform">
        <!-- <NuxtIcon name="local:logo" class="text-3xl" /> -->
        <NuxtImg src="/logo.png" class="size-8" />
      </div>
      <!-- Right Icon -->
      <NuxtLink to="https://www.instagram.com/offlimate_connects/" external target="_blank" rel="noopener">
        <NuxtIcon name="local:instagram" class="fill-white text-2xl" />
      </NuxtLink>
    </div>
  </footer>
</template>
