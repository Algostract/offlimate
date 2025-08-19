<template>
  <section id="hero" class="relative flex flex-col items-center gap-10 md:mt-6 md:flex-row md:justify-between md:gap-4 lg:mb-12 lg:mt-12">
    <div class="flex flex-col items-center gap-6 whitespace-nowrap text-center md:items-start md:text-left">
      <h1 class="text-3xl lg:text-4xl">
        Real Connection <br />
        begins here
      </h1>
      <p class="text-base lg:text-xl">
        Come to event, invite friends, <br />
        find real connections
      </p>
      <ButtonCTA title="Join Upcoming Meetup" to="/auth/signin" />
    </div>
    <div
      class="relative my-4 h-full w-screen grow scale-125 [mask-image:url('/images/ink-stroke.jpg')] [mask-mode:luminance] [mask-position:center] [mask-repeat:no-repeat] [mask-size:130%] md:w-auto">
      <NuxtImg src="/images/hero-image.webp" alt="drone" :width="780" :height="520" />
    </div>
  </section>
</template>
