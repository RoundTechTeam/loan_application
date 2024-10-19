<script setup lang="ts">
import FlatButton from '../FlatButton.vue';

defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: undefined,
  },
  size: {
    type: String,
    default: 'sm',
  },
  padding: {
    type: String,
    default: 'xs',
  },
  round: {
    type: Boolean,
    default: true,
  },
  disable: {
    type: Boolean,
    default: false,
  },
});

defineEmits<{
  (event: 'click'): void;
}>();
</script>

<template>
  <flat-button
    :size="size"
    :round="round"
    :padding="padding"
    :icon="icon"
    :color="color"
    :disable="disable"
    @click="$emit('click')"
  >
    <slot />
  </flat-button>
</template>
