<script setup lang="ts">
import { PropType } from 'vue';

interface Option {
  label: string;
  callback: () => Promise<void>;
}

defineProps({
  options: {
    type: Array as PropType<Option[]>,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'fsecondary',
  },
});
</script>

<template>
  <div @click.stop="null">
    <q-btn-dropdown
      :color="color"
      :label="label"
      outline
      no-caps
      size="md"
      padding="sm md"
      class="t-body-bold bg-white"
    >
      <q-list>
        <q-item
          v-for="(option, index) in options"
          :key="index"
          v-close-popup
          clickable
          @click="option.callback"
        >
          <q-item-section>
            {{ option.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
