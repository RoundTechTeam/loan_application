<script setup lang="ts">
import { warningIcon } from 'src/assets/icons';
import { useDialog } from 'src/composable';
import PrimaryButton from '../buttons/PrimaryButton.vue';
import SecondaryButton from '../buttons/SecondaryButton.vue';
import GlobalDialog from './Dialog.vue';

defineProps({
  icon: {
    type: String,
    default: warningIcon,
  },
  color: {
    type: String,
    default: 'primary',
  },
  title: {
    type: String,
    default: undefined,
  },
  message: {
    type: String,
    default: undefined,
  },
  confirmText: {
    type: String,
    default: undefined,
  },
});

const { dialogRef, cancel, emitData } = useDialog();
</script>

<template>
  <global-dialog ref="dialogRef" @submit="emitData()">
    <div class="row q-gutter-x-md q-pa-lg">
      <div>
        <q-icon :name="icon" :color="color" size="24px" />
      </div>

      <div class="col">
        <div class="t-h3">
          {{ title || 'Confirmation' }}
        </div>

        <div v-if="message" class="q-mt-sm">
          {{ message }}
        </div>
      </div>
    </div>

    <template #actions>
      <secondary-button label="Cancel" @click="cancel" />

      <primary-button
        :label="confirmText || 'Confirm'"
        :color="color"
        autofocus
        type="submit"
      />
    </template>
  </global-dialog>
</template>
