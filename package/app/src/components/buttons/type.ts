import { PropType } from 'vue';
import { RouteLocationRaw } from 'vue-router';

export const buttonProps = {
  color: {
    type: String,
  },
  label: {
    type: String,
  },
  icon: {
    type: String,
  },
  round: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
  },
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
  dense: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: String,
    default: 'sm md',
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  link: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: undefined,
  },
};
