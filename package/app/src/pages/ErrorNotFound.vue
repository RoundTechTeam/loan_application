<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { computed, ref } from 'vue';

const timer = ref(5);

const interval = setInterval(() => {
  timer.value--;
  if (timer.value === 0) {
    clearInterval(interval);
    window.location.href = '/';
  }
}, 1000);

const { width } = useWindowSize();
const isMobile = computed(() => width.value <= 600);
</script>

<template>
  <div
    class="fullscreen bg-white text-white text-center q-pa-md flex flex-center"
  >
    <div class="fixed-top-left" style="top: 0.5rem; left: 0.5rem">
      <img src="/images/logo.png" :height="isMobile ? 90 : 80" />
    </div>
    <div class="text-black row items-center">
      <div class="col-12 col-md-6" style="font-size: 20vh">404</div>

      <div class="text-left col-12 col-md-6 column q-gutter-y-md">
        <div class="text-h3" style="opacity: 0.7">Oops. Nothing here...</div>
        <div class="text-h6" style="opacity: 0.4">
          The link may be broken, or the page may have been removed. Check to
          see if the link you're trying to open is correct.
        </div>
        <div class="fit text-h6">Redirecting in {{ timer }} seconds...</div>
      </div>
    </div>
  </div>
</template>
