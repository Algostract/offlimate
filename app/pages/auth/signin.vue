<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: false,
})

const schema = z.object({
  email: z.email('Please enter a valid email address'),
})

const { r$ } = useRegleSchema({ email: '' }, schema)

function showError(field: 'email') {
  return r$[field].$dirty && r$[field].$error
}

function onSignIn() {
  console.log('Google sign in requested')
}

async function onContinue() {
  const { valid, data } = await r$.$validate()
  if (!valid) return

  console.log({ data })
  // router.push({ path: '/verify', query: { email: data.email } })
}
</script>

<template>
  <main class="flex min-h-screen w-full items-center justify-center p-5">
    <section class="flex w-full max-w-md flex-col gap-5 rounded-2xl bg-dark-500 p-5 shadow-xl ring-1 ring-dark-600" aria-labelledby="login-heading">
      <header>
        <h1 id="login-heading" class="text-lg text-white">Welcome to Offlimate</h1>
        <p class="mt-1 text-light-600 opacity-70">Log in to your account</p>
      </header>
      <!-- Google sign-in -->
      <NuxtLink
        to="/auth/google"
        external
        class="focus:ring-yellow-300 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-3 text-black shadow-sm transition-shadow hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1"
        aria-label="Sign in with Google"
        @click="onSignIn">
        <NuxtIcon name="local:google" class="text-[18px]" />
        <span class="font-medium text-sm">Sign in with Google</span>
      </NuxtLink>
      <div class="flex items-center gap-4 opacity-50">
        <span class="h-px flex-1 bg-light-600"></span>
        <span class="text-xs text-light-600">or</span>
        <span class="h-px flex-1 bg-light-600"></span>
      </div>
      <form class="flex flex-col gap-4" novalidate @submit.prevent="onContinue">
        <!-- email field -->
        <div class="flex flex-col gap-3">
          <label for="email" class="font-medium text-slate-300 block text-sm">Email</label>
          <input
            id="email"
            v-model="r$.$value.email"
            type="email"
            autocomplete="email"
            placeholder="you@email.com"
            class="text-slate-200 w-full rounded-lg bg-transparent px-4 py-3 ring-2 ring-dark-600 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
            :aria-invalid="r$.$invalid ? 'true' : 'false'" />
          <p v-if="showError('email')" class="text-xs text-alert-500">{{ r$.email.$errors[0] }}</p>
        </div>
        <!-- continue button -->
        <button
          type="submit"
          :disabled="r$.$invalid"
          class="font-medium w-full rounded-lg py-3 text-base transition-all disabled:cursor-not-allowed disabled:opacity-60"
          :class="!r$.$invalid ? 'bg-white text-black' : 'bg-black text-white'">
          Continue with Email
        </button>
      </form>
      <!-- subtle footer / link -->
      <div class="text-center text-xs text-white opacity-60">
        By continuing, you agree to our <NuxtLink to="/terms" class="underline">Terms</NuxtLink> and <NuxtLink to="/privacy" class="ml-1 underline">Privacy Policy</NuxtLink>.
      </div>
    </section>
  </main>
</template>
