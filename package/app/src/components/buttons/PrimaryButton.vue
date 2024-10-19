<script setup lang="ts">
import { QBtn } from 'quasar';
import { buttonProps } from './type';

const props = defineProps({
  ...buttonProps,
  color: {
    type: String,
    default: 'primary',
  },
  btnClass: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits<{
  (event: 'click'): void;
}>();
</script>

<template>
  <div :style="[`border-radius: ${round ? '50%' : '4px'}`]" @click.stop="null">
    <q-btn
      unelevated
      :icon="props.icon"
      :size="props.size"
      :color="props.color"
      :dense="props.dense"
      :label="props.label"
      :round="props.round"
      :type="props.type"
      :disable="props.disable"
      :padding="props.padding"
      :rounded="props.rounded"
      :class="btnClass"
      :autofocus="props.autofocus"
      class="t-body-bold"
      no-caps
      @click="emit('click')"
    >
      <slot />
    </q-btn>
  </div>
</template>
