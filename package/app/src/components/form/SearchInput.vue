<script setup lang="ts">
import { closeIcon, searchIcon } from 'src/assets/icons';
import { PropType } from 'vue';
import { IconButton } from '..';
import { inputProps } from './input';

const props = defineProps({
  ...inputProps,
  placeholder: {
    type: String as PropType<string | undefined>,
    default: undefined,
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (event: 'update:model-value', phone: string): void;
}>();

function input(input: string | number | null) {
  emit('update:model-value', input?.toString() || '');
}
</script>

<template>
  <q-input
    dense
    outlined
    hide-bottom-space
    :debounce="debounce"
    :placeholder="props.placeholder || 'Search'"
    :disable="props.disable"
    :autofocus="props.autofocus"
    :prefix="props.prefix"
    :suffix="props.suffix"
    :rules="[
      (val) => !props.required || (val && val.length > 0) || 'Required',
      ...props.rules,
    ]"
    :model-value="props.modelValue"
    @update:model-value="input"
  >
    <template #append>
      <div style="height: inherit">
        <q-icon v-if="!modelValue" :name="searchIcon" size="xs" />
        <icon-button
          v-else
          padding="xs"
          dense
          :icon="closeIcon"
          @click="() => input('')"
        />
      </div>
    </template>
  </q-input>
</template>
