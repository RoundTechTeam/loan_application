<script setup lang="ts">
import PrimaryButton from '../PrimaryButton.vue';
import { addIcon } from 'src/assets/icons';

defineProps({
  label: {
    type: String,
    default: 'Add',
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
  <primary-button
    :disable="disable"
    :label="label"
    :icon="addIcon"
    @click="$emit('click')"
  />
</template>
