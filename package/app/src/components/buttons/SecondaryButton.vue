<script setup lang="ts">
import { buttonProps } from './type';

const props = defineProps({
  ...buttonProps,
  color: {
    type: String,
    default: 'fsecondary',
  },
});

const emit = defineEmits<{
  (event: 'click'): void;
}>();
</script>

<template>
  <div :style="[`border-radius: ${round ? '50%' : '4px'}`]" @click.stop="null">
    <q-btn
      outline
      class="bg-white"
      style="font-weight: 600"
      :icon="props.icon"
      :size="props.size ?? '14px'"
      :color="props.color"
      :dense="props.dense"
      :label="props.label"
      :round="props.round"
      :type="props.type"
      :disable="props.disable"
      :padding="props.padding"
      :rounded="props.rounded"
      no-caps
      @click="emit('click')"
    >
      <slot />
    </q-btn>
  </div>
</template>
