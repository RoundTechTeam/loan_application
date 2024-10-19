<script setup lang="ts">
export type InputModel = string | number | boolean | null;

import { validate } from 'src/helpers';
import { inputProps } from './input';
import TextInput from './TextInput.vue';
const props = defineProps({
  ...inputProps,
  title: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: 'Enter email',
  },
});

const emits =
  defineEmits<(event: 'update:model-value', value: InputModel) => void>();

function input(v: InputModel) {
  emits('update:model-value', v);
}
</script>

<template>
  <text-input
    :model-value="props.modelValue"
    :title="props.title || 'Email'"
    :disable="props.disable"
    :required="props.required"
    :autofocus="props.autofocus"
    :debounce="debounce"
    :prefix="props.prefix"
    :suffix="props.suffix"
    :rules="[
      (val) =>
        !props.required || (val && val.length > 0) || 'Email is required',
      (val) => !val || validate.email(val) || 'Invalid email',
      ...props.rules,
    ]"
    :placeholder="props.placeholder"
    @update:model-value="input"
  />
</template>
