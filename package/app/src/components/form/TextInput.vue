<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { inputProps } from './input';
import AppForm from './AppForm.vue';
import { InputModel } from '../type';
import { QInput } from 'quasar';

type InputType =
  | 'number'
  | 'date'
  | 'time'
  | 'email'
  | 'search'
  | 'text'
  | 'password'
  | 'textarea'
  | 'tel'
  | 'file'
  | 'url'
  | undefined;

const props = defineProps({
  ...inputProps,
  title: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: [String, undefined] as PropType<InputType>,
    default: 'text',
  },
  number: {
    type: Object as PropType<{
      decimal?: number;
      min?: number;
      max?: number;
    }>,
    default: undefined,
  },
  flat: {
    type: Boolean,
    default: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits<{
  (event: 'update:model-value', value: any): void;
  (event: 'focus'): void;
}>();

const requiredMessage =
  typeof props.required === 'string' ? props.required : 'Required';
const inputRules = [
  (val: InputModel) => {
    if (!props.required) return true;
    if (typeof val === 'string' && !!val.trim()) return true;
    if (typeof val === 'number' && (!!val || val === 0)) return true;
    return requiredMessage;
  },
  (val: InputModel) => {
    if (props.type !== 'number' || !props.number) return true;
    if (!props.required && !val && val !== 0) return true;
    if (!val && val !== 0) return 'Invalid number';
    if (props.number.decimal !== undefined) {
      const [, decimal] = val.toString().split('.');
      if (decimal && decimal.length > props.number.decimal) {
        return `Max ${props.number.decimal} decimal point`;
      }
    }
    if (props.number.min !== undefined && val < props.number.min) {
      return `Min value is ${props.number.min}`;
    }
    if (props.number.max !== undefined && val > props.number.max) {
      return `Max value is ${props.number.max}`;
    }
    return true;
  },
  ...props.rules,
];

const step = computed(() => {
  if (props.number?.decimal) {
    const decimal = 10 ** props.number.decimal;
    return 1 / decimal;
  }
  return undefined;
});

function input(v: InputModel) {
  if (props.type === 'number') {
    if (!props.required && !v) emits('update:model-value', v);

    let value = parseFloat((v || props.number?.min || 0).toString());
    if (props.number && props.number.decimal !== undefined) {
      value = parseFloat(value.toFixed(props.number.decimal));
    }
    emits('update:model-value', value);
  } else {
    emits('update:model-value', v);
  }
}

const inputRef = ref<QInput>();
async function validate() {
  const res = await inputRef.value?.validate();
  return res || false;
}

defineExpose({
  validate,
});
</script>

<template>
  <app-form :title="title" :required="required">
    <q-input
      ref="inputRef"
      :model-value="modelValue"
      :autofocus="autofocus"
      :rules="inputRules"
      :placeholder="placeholder"
      :disable="disable"
      :prefix="prefix"
      :suffix="suffix"
      :type="type"
      :borderless="flat"
      :outlined="!flat"
      :class="{ 'input-hide-error': hideError }"
      :debounce="debounce"
      :step="step"
      dense
      hide-bottom-space
      @update:model-value="input"
      @focus="emits('focus')"
    >
      <template #append>
        <slot name="append" />
      </template>
    </q-input>
  </app-form>
</template>
