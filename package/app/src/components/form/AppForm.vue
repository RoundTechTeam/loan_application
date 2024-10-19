<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  required: {
    type: [Boolean, String],
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    :class="{
      'row q-gutter-x-md': inline,
    }"
  >
    <slot name="top">
      <div v-if="props.title" class="q-mb-sm form-title text-weight-bold">
        <span v-if="props.required" class="q-mr-xs text-red">*</span
        >{{ props.title }}
      </div>
    </slot>

    <div class="form-input">
      <slot />
    </div>
  </div>
</template>
