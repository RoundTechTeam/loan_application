<script setup lang="ts">
import { PropType, ref, computed, useSlots } from 'vue';
import { useFormChild } from 'quasar';
import AppForm from './AppForm.vue';
import { CheckboxOption } from '../type';
import { clone, randomString } from 'src/helpers';

const props = defineProps({
  options: {
    type: Array as PropType<CheckboxOption[]>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Array as PropType<unknown[]>,
    required: true,
  },
  showAllToggle: {
    type: [Boolean, String],
    default: true,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: undefined,
  },
  showIntermediate: {
    type: Boolean,
    default: true,
  },
  gutter: {
    type: Number,
    default: undefined,
  },
  falsyShowSlot: {
    type: Boolean,
    default: false,
  },
  bottomSlotIndent: {
    type: String,
    default: '36px',
  },
});

const emits = defineEmits<{
  (event: 'update:model-value', value: any[]): void;
}>();

const showErrorMessage = ref(false);

const slots = useSlots();

const errorMessage = computed(() => {
  if (props.modelValue.length < props.min) {
    return `Min selection ${props.min}`;
  }

  if (props.max !== undefined && props.modelValue.length > props.max) {
    return `Max selection ${props.max}`;
  }

  return true;
});

const formId = `checkbox-${randomString(6)}`;

const isError = computed(() => {
  return errorMessage.value !== true;
});

useFormChild({
  validate: () => {
    showErrorMessage.value = true;
    if (isError.value) {
      const elem = document.getElementById(formId);
      elem?.scrollIntoView({ behavior: 'smooth' });
    }
    return !isError.value;
  },
  resetValidation: () => {
    showErrorMessage.value = false;
  },
  requiresQForm: true,
});

const optionValues = computed(() =>
  props.modelValue.filter((v) => props.options.some((opt) => opt.value === v))
);
const allOptionLabel = computed(() =>
  typeof props.showAllToggle === 'boolean' ? 'All' : props.showAllToggle
);

const allOptionValue = computed(() => {
  if (
    props.options.length > 0 &&
    props.options.length === optionValues.value.length
  )
    return true;
  if (props.showIntermediate)
    return optionValues.value.length === 0 ? false : null;
  return false;
});

function toggleAll() {
  const otherOptions = props.modelValue.filter(
    (v) => !optionValues.value.includes(v)
  );
  if (allOptionValue.value === true) {
    emits('update:model-value', otherOptions);
  } else {
    emits('update:model-value', [
      ...otherOptions,
      ...props.options.filter((opt) => !opt.disable).map((opt) => opt.value),
    ]);
  }
}

function toggle(key: string, value: boolean) {
  let cloned = clone(props.modelValue);
  if (!value) {
    cloned = cloned.filter((v) => v !== key);
  } else if (cloned.every((v) => v !== key)) {
    cloned.push(key);
  }
  emits('update:model-value', cloned);
}
</script>

<template>
  <app-form :id="formId" :title="title" :required="false">
    <template #top>
      <slot name="top" />
    </template>

    <q-checkbox
      v-if="props.showAllToggle"
      :model-value="allOptionValue"
      :disable="disable"
      :label="allOptionLabel"
      :style="`margin-bottom: ${props.gutter}px`"
      size="sm"
      class="q-mb-sm"
      dense
      @update:model-value="toggleAll"
    />
    <div
      v-for="(option, index) in options"
      :key="option.value"
      :style="`margin-bottom: ${
        index < options.length - 1 ? props.gutter : 0
      }px`"
      :class="index < options.length - 1 ? 'q-mb-sm' : ''"
    >
      <div class="row justify-between">
        <div class="col flex items-center">
          <q-checkbox
            :model-value="modelValue.includes(option.value)"
            :disable="disable || option.disable"
            size="sm"
            dense
            @update:model-value="(v: boolean) => toggle(option.value, v)"
          >
            <template #default>
              <div>
                {{ option.label }}
                <span :class="option.suffix?.class">{{
                  option.suffix?.text
                }}</span>
              </div>
            </template>
          </q-checkbox>
        </div>
        <div
          v-if="
            slots[`checkbox-${option.key || option.value}-end`] &&
            (modelValue.includes(option.value) || falsyShowSlot)
          "
          :class="{ 'q-checkbox disabled': disable || option.disable }"
          class="col"
        >
          <slot
            :name="`checkbox-${option.key || option.value}-end`"
            :option="option"
            :value="modelValue.includes(option.value)"
            :disable="disable || option.disable"
          />
        </div>
      </div>

      <div
        v-if="
          slots[`checkbox-${option.key || option.value}-bottom`] &&
          (modelValue.includes(option.value) || falsyShowSlot)
        "
        class="q-mt-sm"
        :style="`margin-left: ${bottomSlotIndent}`"
        :class="{ 'q-checkbox disabled': disable || option.disable }"
      >
        <slot
          :name="`checkbox-${option.key || option.value}-bottom`"
          :option="option"
          :disable="disable || option.disable"
          :value="modelValue.includes(option.value)"
        />
      </div>
    </div>

    <div
      v-if="showErrorMessage && isError"
      class="q-pa-sm form-error-message text-error"
    >
      {{ errorMessage }}
    </div>
  </app-form>
</template>
