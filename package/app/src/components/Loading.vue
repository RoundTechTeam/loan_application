<script setup lang="ts">
import { AppSpinner } from '.';

defineProps({
  message: {
    type: String,
    default: 'Loading...',
  },
});
</script>

<template>
  <div class="row items-center justify-center" style="height: 70vh">
    <AppSpinner loading :message="message" />
  </div>
</template>
