<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    default: 0,
  },
  maxPages: {
    type: Number,
    default: 5,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  debounce: {
    type: Number,
    default: 0,
  },
  totalRecord: {
    type: Number as PropType<number | null>,
    default: undefined,
  },
});

const emits = defineEmits<{
  (event: 'update:model-value', page: number): void;
}>();

function changePage(page: number) {
  emits('update:model-value', page);
}

function onPageInput(page: string | number | null) {
  const p = parseInt(page?.toString() || '0');
  if (p < 1 || p > props.totalPages) return;
  changePage(p);
}
</script>

<template>
  <div class="full-width row items-center justify-end q-gutter-x-lg">
    <slot name="before" />
    <q-pagination
      :model-value="modelValue"
      :max="totalPages"
      :max-pages="maxPages"
      :disable="disable"
      active-color="fprimary-1"
      active-design="unelevated"
      active-text-color="primary"
      color="neutral-300"
      boundary-numbers
      boundary-links
      direction-links
      flat
      @update:model-value="changePage"
    />

    <div class="row items-center">
      <div class="q-mr-md">Go to page</div>
      <div class="app-table-pagination-input">
        <q-input
          :model-value="modelValue"
          :disable="disable"
          :debounce="debounce"
          dense
          filled
          type="number"
          @update:model-value="onPageInput"
        />
      </div>
    </div>
    <slot name="after">
      <div v-if="totalRecord || totalRecord === 0" class="t-system">
        Total {{ totalRecord }} records
      </div>
    </slot>
  </div>
</template>
