<script setup lang="ts">
import type { z } from 'zod'

definePageMeta({
  layout: false,
  middleware: ['guest'],
})

type UserFormData = z.infer<typeof userFormSchema>

const { r$ } = useRegleSchema(
  {
    name: '',
    dob: '',
    gender: 'male',
    phone: '',
  },
  userFormSchema
)

function showError(field: keyof UserFormData) {
  return r$[field].$dirty && r$[field].$error
}

const { status, execute } = useFetch('/api/user', {
  method: 'POST',
  body: r$.$value,
  immediate: false,
  watch: false,
})

async function onSubmit() {
  const { valid } = await r$.$validate()
  if (!valid || status.value === 'pending') return

  await execute()

  if (status.value === 'success') {
    navigateTo('/event')
  }
}
</script>

<template>
  <main class="flex min-h-screen w-full items-center justify-center p-5">
    <section class="flex w-full max-w-2xl flex-col gap-6 rounded-2xl bg-dark-500 p-6 shadow-xl ring-1 ring-dark-600" aria-labelledby="signup-heading">
      <header>
        <h1 id="signup-heading" class="text-xl text-white">Sign up</h1>
        <p class="mt-1 text-light-600">Fill out the form to apply as a user</p>
      </header>
      <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Name -->
          <div class="flex flex-col gap-3">
            <label for="name" class="font-medium text-slate-300 text-sm after:ml-1 after:text-alert-500 after:content-['*']">Full name</label>
            <input
              id="name"
              v-model="r$.$value.name"
              type="text"
              autocomplete="name"
              placeholder="Your full name"
              class="text-slate-200 w-full rounded-lg bg-transparent px-4 py-3 ring-2 ring-dark-600 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
              :aria-invalid="showError('name') ? 'true' : 'false'" />
            <p v-if="showError('name')" class="text-xs text-alert-500">{{ r$.name.$errors[0] }}</p>
          </div>
          <!-- DOB -->
          <div class="flex flex-col gap-3">
            <label for="dob" class="font-medium text-slate-300 text-sm after:ml-1 after:text-alert-500 after:content-['*']">Date of birth</label>
            <input
              id="dob"
              v-model="r$.$value.dob"
              type="date"
              placeholder="YYYY-MM-DD"
              class="text-slate-200 w-full rounded-lg bg-transparent px-4 py-3 ring-2 ring-dark-600 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
              :aria-invalid="showError('dob') ? 'true' : 'false'" />
            <p v-if="showError('dob')" class="text-xs text-alert-500">{{ r$.dob.$errors[0] }}</p>
          </div>
          <!-- Gender -->
          <div class="flex flex-col gap-3">
            <label class="font-medium text-slate-300 text-sm after:ml-1 after:text-alert-500 after:content-['*']">Gender</label>
            <div class="mt-2 flex gap-3">
              <label class="inline-flex items-center gap-2">
                <input v-model="r$.$value.gender" type="radio" value="male" />
                <span class="text-sm">Male</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input v-model="r$.$value.gender" type="radio" value="female" />
                <span class="text-sm">Female</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input v-model="r$.$value.gender" type="radio" value="other" />
                <span class="text-sm">Other</span>
              </label>
            </div>
            <p v-if="showError('gender')" class="text-xs text-alert-500">{{ r$.gender.$errors[0] }}</p>
          </div>
          <div class="flex flex-col gap-3">
            <label for="phone" class="font-medium text-slate-300 text-sm after:ml-1 after:text-alert-500 after:content-['*']">Phone</label>
            <input
              id="phone"
              v-model="r$.$value.phone"
              type="tel"
              inputmode="tel"
              placeholder="9876543210"
              class="text-slate-200 w-full rounded-lg bg-transparent px-4 py-3 ring-2 ring-dark-600 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
              :aria-invalid="showError('phone') ? 'true' : 'false'" />
            <p v-if="showError('phone')" class="text-xs text-alert-500">{{ r$.phone.$errors[0] }}</p>
          </div>
        </div>
        <!-- Actions -->
        <button
          type="submit"
          :disabled="r$.$invalid"
          class="font-medium flex w-full items-center justify-center gap-1.5 rounded-lg py-3 text-base transition-all disabled:cursor-not-allowed disabled:opacity-60"
          :class="!r$.$invalid ? 'bg-white text-black' : 'bg-black text-white'">
          <NuxtIcon v-if="status === 'pending'" name="local:loader" class="text-[24px]" />Submit
        </button>
      </form>
    </section>
  </main>
</template>
