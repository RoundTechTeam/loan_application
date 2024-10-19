<script setup lang="ts">
import { QSelect, ValidationRule } from 'quasar';
import { computed, PropType, ref, watch } from 'vue';
import { PickerOption } from '../type';

type Union = number | string;

const props = defineProps({
  modelValue: {
    type: [String, Array] as PropType<Union | Union[]>,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array as PropType<PickerOption[]>,
    required: true,
  },
  allOptionsLabel: {
    type: String,
    default: 'All options',
  },
  noOptionLabel: {
    type: String,
    default: 'Select option',
  },
  disable: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Array as PropType<ValidationRule[]>,
    default: () => [],
  },
  maxOptions: {
    type: Number,
    default: undefined,
  },
});

const emits = defineEmits<{
  (event: 'update:model-value', v: Union | Union[]): void;
}>();

const options = ref(props.options);
const pickerOptions = computed(() => {
  if (!props.maxOptions) return options.value;
  if (!Array.isArray(props.modelValue)) return options.value;
  if (props.modelValue.length === props.maxOptions && props.multiple) {
    return options.value.map((v) => {
      if (!Array.isArray(props.modelValue)) return v;
      if (props.modelValue.some((l) => l === v.value)) return v;
      else return { ...v, disable: true };
    });
  }
  return options.value;
});
const select = ref<QSelect>();

const selectedValue = computed(() => {
  return Array.isArray(props.modelValue)
    ? props.modelValue
    : [props.modelValue];
});

const allSelectorValue = computed(() => {
  const values = options.value.map((v) => v.value);
  const filtered = selectedValue.value.filter((v) => values.includes(v));
  if (filtered.length === options.value.length) return true;
  return filtered.length === 0 ? false : null;
});

const searching = ref(false);
const noOptionLabel = computed(() =>
  searching.value ? '' : props.noOptionLabel
);
const displayValue = computed<string>(() => {
  if (!selectedValue.value?.length) return noOptionLabel.value;

  const option = options.value.find(
    (opt) => opt.value === selectedValue.value[0]
  )?.label;
  if (!props.multiple) return option || noOptionLabel.value;

  if (selectedValue.value.length === 1) return option || '-';

  if (allSelectorValue.value) {
    return props.allOptionsLabel;
  } else {
    return `${selectedValue.value.length} Selected`;
  }
});

function toggleAll() {
  const values = options.value.map((v) => v.value);
  const otherOptions = selectedValue.value.filter((v) => !values.includes(v));
  if (allSelectorValue.value) {
    emits('update:model-value', otherOptions);
  } else {
    emits('update:model-value', [...otherOptions, ...values]);
    select.value?.hidePopup();
  }
}

function onInput(v: string | string[]) {
  options.value = props.options;
  emits('update:model-value', v);
}

function filterFn(
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
) {
  update(() => {
    if (val.length > 0) searching.value = true;
    else searching.value = false;
    const needle = val.toLocaleLowerCase();
    options.value = props.options.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}

watch(
  () => props.options,
  (v) => {
    options.value = v;
  }
);
</script>

<template>
  <q-select
    ref="select"
    :model-value="modelValue"
    :options="pickerOptions"
    :multiple="multiple"
    :disable="disable"
    :max-values="maxOptions"
    dense
    outlined
    emit-value
    map-options
    use-input
    fill-input
    input-debounce="0"
    behavior="menu"
    @filter="filterFn"
    @update:model-value="onInput"
    :rules="rules"
  >
    <template #selected> {{ multiple ? displayValue : '' }} </template>

    <template #before-options>
      <q-item v-if="multiple" clickable dense @click="toggleAll">
        <q-item-section side>
          <q-checkbox
            :model-value="allSelectorValue"
            dense
            @update:model-value="toggleAll"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ allOptionsLabel }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template #option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" dense>
        <q-item-section v-if="multiple" side>
          <q-checkbox
            :model-value="selected"
            dense
            @update:model-value="toggleOption(opt)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label :class="!multiple && selected ? 'primary' : 'black'">
            {{ opt.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-italic text-grey">
          {{ noOptionLabel }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<style>
.q-field--with-bottom {
  padding-bottom: 0px;
}
</style>
