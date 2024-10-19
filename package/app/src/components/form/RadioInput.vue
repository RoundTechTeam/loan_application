<script setup lang="ts">
import { PropType } from 'vue';
import AppForm from './AppForm.vue';

type InputType = string | number | null | undefined;

interface RadioOption {
  key?: string;
  label: string;
  value: InputType;
  disable?: boolean;
}

defineProps({
  options: {
    type: Array as PropType<RadioOption[]>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number, Object] as PropType<InputType>,
    required: true,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits<{
  (event: 'update:model-value', value: string): void;
}>();

function onSelect(v: string) {
  emits('update:model-value', v);
}
</script>

<template>
  <app-form :title="title" :required="false">
    <div :class="{ 'row q-gutter-x-lg': inline }">
      <div
        v-for="(option, index) in options"
        :key="index"
        :class="{
          'q-mb-sm': index < options.length - 1,
        }"
      >
        <q-radio
          :model-value="modelValue"
          :val="option.value"
          :label="option.label"
          :disable="disable || option.disable"
          dense
          @update:model-value="onSelect"
        />
        <div v-if="option.value === modelValue" style="margin-left: 27px">
          <slot name="option-bottom" :option="option" />
        </div>
      </div>
    </div>
  </app-form>
</template>
