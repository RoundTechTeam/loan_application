import { PropType } from 'vue';
import { ValidationRule } from 'quasar';

export const inputProps = {
  autofocus: {
    type: Boolean,
    default: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  required: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },
  modelValue: {
    type: [String, Number, null, undefined] as PropType<
      string | number | null | undefined
    >,
    default: undefined,
  },
  rules: {
    type: Array as PropType<ValidationRule[]>,
    default: () => [],
  },
  prefix: {
    type: String,
    default: undefined,
  },
  suffix: {
    type: String,
    default: undefined,
  },
  hideError: {
    type: Boolean,
    default: false,
  },
  debounce: {
    type: Number,
    default: undefined,
  },
};
