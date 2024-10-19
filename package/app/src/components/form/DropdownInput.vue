<script setup lang="ts">
import { QSelect, ValidationRule, useFormChild } from 'quasar';
import { PropType, computed, ref, watch } from 'vue';
import AppForm from './AppForm.vue';

const props = defineProps({
  modelValue: {
    type: null as unknown as PropType<
      string | boolean | number | null | undefined
    >,
    validator: (v) => typeof v === 'string' || v === null,
    required: true,
  },
  options: {
    type: Array as PropType<
      {
        label: string;
        value: any;
        disable?: boolean;
      }[]
    >,
    required: true,
  },
  required: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: undefined,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  displayValue: {
    type: String,
    default: undefined,
  },
  noValue: {
    type: String,
    default: 'No option',
  },
  hideNoOption: {
    type: Boolean,
    default: true,
  },
  rules: {
    type: Array as PropType<ValidationRule[]>,
    default: () => [],
  },
  customOptions: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits<{
  (event: 'update:model-value', v: string | null): void;
  (event: 'update:blur', v: string | null): void;
}>();

const data = ref(props.options);
const filteredOptions = computed(() => {
  return !props.required &&
    !props.hideNoOption &&
    data.value.every((opt) => opt.value !== null)
    ? [
        {
          label: props.noValue,
          value: null,
        },
        ...data.value,
      ]
    : data.value;
});

const errMessage = ref('');

function resetValidation() {
  errMessage.value = '';
}

async function validate() {
  if (
    props.required &&
    data.value.every((opt) => opt.value !== props.modelValue) &&
    !props.customOptions
  ) {
    errMessage.value = 'Required';
    return false;
  } else if (props.customOptions && props.required && !props.modelValue) {
    errMessage.value = 'Required';
    return false;
  }
  errMessage.value = '';
  return true;
}

function onInput(v: string | null) {
  if (props.customOptions) updateValue(v);
}

function updateValue(v: string | null) {
  emits('update:model-value', v);
  resetValidation();
}

function onBlur(v: string | null) {
  if (props.customOptions) {
    emits('update:blur', v);
    resetValidation();
  }
}

useFormChild({
  validate,
  resetValidation,
  requiresQForm: true,
});

function filterFn(
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
) {
  update(() => {
    const needle = val.toLocaleLowerCase();
    data.value = props.options.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}

watch(
  () => props.options,
  () => {
    data.value = props.options;
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<template>
  <app-form :title="props.title" :required="props.required">
    <div @click.stop="null">
      <q-select
        :model-value="modelValue"
        :options="filteredOptions"
        :disable="disable"
        :error="!!errMessage"
        :error-message="errMessage"
        :display-value="displayValue"
        dense
        outlined
        emit-value
        use-input
        hide-bottom-space
        map-options
        hide-selected
        fill-input
        behavior="menu"
        input-debounce="0"
        @filter="filterFn"
        @update:model-value="updateValue"
        @blur="onBlur"
        @input-value="onInput"
        :rules="rules"
      />
    </div>
  </app-form>
</template>
