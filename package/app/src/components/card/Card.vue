<script setup lang="ts">
defineProps({
  fullWidth: {
    type: Boolean,
    default: true,
  },
  margin_y: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <q-card
    flat
    bordered
    class="shadow-5"
    :class="{
      'full-width': fullWidth,
      'q-my-xs': margin_y,
    }"
  >
    <slot name="title" />

    <div class="row items-center q-pa-sm">
      <slot name="content" />
    </div>

    <div class="row justify-end items-center">
      <slot name="actions" />
    </div>
  </q-card>
</template>
