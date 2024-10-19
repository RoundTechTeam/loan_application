<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();
</script>

<template>
  <div class="q-pa-sm">
    <div class="row items-center q-gutter-x-xs q-gutter-y-sm">
      <slot name="icon" />
      <slot name="title" />

      <q-space v-if="!!slots.actions" />

      <slot name="actions" />
    </div>
  </div>
</template>
