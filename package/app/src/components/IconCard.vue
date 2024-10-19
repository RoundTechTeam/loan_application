<template>
  <q-card class="bg-transparent no-shadow no-border col">
    <q-card-section class="q-pa-none">
      <div class="col-md-3 col-sm-12 col-xs-12">
        <q-item
          :style="`background-color: ${color.background}`"
          class="q-pa-none"
        >
          <q-item-section
            side
            :style="`background-color: ${color.primary}`"
            class="q-pa-lg q-mr-none text-white"
          >
            <q-icon :name="icon" color="white" size="24px"></q-icon>
          </q-item-section>
          <q-item-section class="q-pa-md q-ml-none text-white">
            <q-item-label class="text-white text-h6 text-weight-bolder">{{
              value
            }}</q-item-label>
            <q-item-label>{{ title }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  color: {
    type: Object as PropType<{ background: string; primary: string }>,
    required: true,
  },
});
</script>
