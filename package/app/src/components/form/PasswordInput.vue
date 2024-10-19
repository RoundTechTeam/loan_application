<script setup lang="ts">
import { visibleIcon, visibleOffIcon } from 'src/assets/icons';
import { ref, computed } from 'vue';
import AppForm from './AppForm.vue';
import { inputProps } from './input';

const props = defineProps({
  ...inputProps,
  modelValue: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Password',
  },
});

const emit = defineEmits<{
  (event: 'update:model-value', phone: string): void;
}>();

const revealPassword = ref(false);

const inputType = computed(() => {
  return revealPassword.value ? 'text' : 'password';
});

const inputIcon = computed(() => {
  return revealPassword.value ? visibleIcon : visibleOffIcon;
});

function updatePassword(input: string | number | null) {
  emit('update:model-value', input?.toString() || '');
}

function toggleReveal() {
  revealPassword.value = !revealPassword.value;
}
</script>

<template>
  <app-form :title="props.title" :required="props.required">
    <q-input
      dense
      outlined
      hide-bottom-space
      :disable="props.disable"
      :autofocus="props.autofocus"
      :model-value="props.modelValue"
      :prefix="props.prefix"
      :suffix="props.suffix"
      :rules="[
        (val) =>
          !props.required || (val && val.length > 0) || 'Password is required',
        ...props.rules,
      ]"
      :type="inputType"
      @update:model-value="updatePassword"
    >
      <template #append>
        <q-icon :name="inputIcon" size="xs" @click="toggleReveal" />
      </template>
    </q-input>
  </app-form>
</template>
