<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: undefined,
  },
  disable: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits<{
  (event: 'update:model-value', v: boolean): void;
}>();
</script>

<template>
  <div class="row items-start q-gutter-x-sm">
    <div class="col">
      <div class="form-title">
        {{ label }}
      </div>
      <div v-if="description" class="q-mt-xxs text-fsecondary">
        {{ description }}
      </div>
    </div>
    <q-toggle
      dense
      :model-value="modelValue"
      :disable="disable"
      class="custom_toggle"
      @update:model-value="emits('update:model-value', $event)"
    />
  </div>
</template>
