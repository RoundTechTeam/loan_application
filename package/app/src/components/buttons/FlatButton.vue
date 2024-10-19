<script setup lang="ts">
import { buttonProps } from './type';

defineProps({
  ...buttonProps,
});

const emit = defineEmits<{
  (event: 'click'): void;
}>();
</script>

<template>
  <div :style="[`border-radius: ${round ? '50%' : '4px'}`]" @click.stop="null">
    <q-btn
      flat
      :icon="icon"
      :size="size"
      :color="color"
      :dense="dense"
      :label="label"
      :round="round"
      :type="type"
      :disable="disable"
      :padding="padding"
      :rounded="rounded"
      :to="link"
      no-caps
      style="font-weight: 500"
      @click="emit('click')"
    >
      <slot />
    </q-btn>
  </div>
</template>
