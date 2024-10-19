<script setup lang="ts">
import { onMounted, PropType } from 'vue';
import CheckboxInput from '../form/CheckboxInput.vue';
import RadioInput from '../form/RadioInput.vue';

export interface Group {
  label: string;
  value: string;
  options: {
    label: string;
    value: string;
  }[];
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    required: true,
  },
  groups: {
    type: Array as PropType<Group[]>,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits<{
  (event: 'update:model-value', value: string[]): void;
}>();

function selectSingleOption(value: string) {
  emits('update:model-value', [value]);
}

onMounted(() => {
  if (
    !props.multiple &&
    props.modelValue.length === 0 &&
    props.groups.length > 0
  ) {
    selectSingleOption(props.groups[0].options[0].value);
  }
});
</script>

<template>
  <div class="overflow-auto">
    <div v-if="groups.length === 0">No available option</div>
    <div
      v-for="group in groups"
      :key="group.value"
      class="q-mb-md form-wrapper"
    >
      <template v-if="multiple">
        <checkbox-input
          :model-value="modelValue"
          :title="group.label"
          :options="group.options"
          @update:model-value="(v) => emits('update:model-value', v)"
        />
      </template>
      <template v-else>
        <radio-input
          :model-value="modelValue[0] || ''"
          :title="group.label"
          :options="group.options"
          @update:model-value="selectSingleOption"
        />
      </template>
    </div>
  </div>
</template>
