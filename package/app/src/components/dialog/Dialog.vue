<script setup lang="ts">
import { useSlots, PropType, computed } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import FlatButton from '../buttons/FlatButton.vue';
import { useForm, useResponsive } from 'src/composable';

type Position = 'standard' | 'top' | 'right' | 'bottom' | 'left' | undefined;

const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  persistent: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: String,
    default: 'none',
  },
  position: {
    type: String as PropType<Position>,
    default: 'standard',
  },
  size: {
    type: Object as PropType<{ width?: string; height?: string }>,
    default: undefined,
  },
});

const emits = defineEmits([
  ...useDialogPluginComponent.emits,
  'submit',
  'validate-success',
]);

const { isMobile } = useResponsive();
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } =
  useDialogPluginComponent();
const { formRef, validate, resetValidation } = useForm();
const slots = useSlots();

const isFullscreen = computed(() => props.fullscreen && !isMobile.value);
const sideDialog = props.position === 'left' || props.position === 'right';
const fullHeight = computed(
  () => props.fullscreen || sideDialog || isMobile.value
);
const hasTitle = !!slots['header'] || !!props.title;
const hasAction = !!slots['actions'];

defineExpose({
  onDialogCancel,
  onDialogOK,
  validate,
  reset: resetValidation,
});
</script>

<template>
  <q-dialog
    ref="dialogRef"
    :position="position"
    :persistent="persistent"
    :maximized="fullscreen || isMobile"
    :class="{
      'fullscreen-dialog': fullscreen || isMobile,
      'fullheight-dialog': sideDialog || fullscreen,
    }"
    @hide="onDialogHide"
  >
    <q-card
      :class="{ fit: fullHeight || fullscreen }"
      :style="[
        `width: ${size?.width} !important; height: ${size?.height} !important`,
        {
          'min-width: clamp(320px, 500px, 30vw)': !isMobile,
        },
      ]"
      class="q-dialog-plugin column no-wrap"
    >
      <q-form
        ref="formRef"
        class="full-height column no-wrap"
        style="max-height: inherit"
        @submit.prevent="() => emits('submit')"
        @validation-success="() => emits('validate-success')"
      >
        <div v-if="hasTitle" style="position: sticky">
          <q-card-section class="q-px-sm q-py-none dialog-header">
            <slot name="header">
              <div
                v-if="props.title"
                class="full-width row items-center"
                style="overflow: hidden"
                :style="`height: ${isFullscreen ? '56' : '48'}px`"
              >
                <div v-if="!persistent" style="width: 32px">
                  <flat-button
                    round
                    padding="xs"
                    icon="close"
                    @click="onDialogCancel"
                  />
                </div>
                <div
                  class="col"
                  :class="isFullscreen ? 'q-ml-md' : 'text-center'"
                >
                  <div :class="isFullscreen ? 't-h3' : 't-title'">
                    {{ props.title }}
                  </div>
                </div>
                <slot name="top-right">
                  <div v-if="!isFullscreen" style="width: 32px" />
                  <div v-else class="row q-gutter-x-md">
                    <slot name="actions" />
                  </div>
                </slot>
              </div>
            </slot>
          </q-card-section>
        </div>
        <q-separator v-if="props.title && !fullHeight" />
        <q-card-section
          :class="[`q-pa-${props.padding}`]"
          class="col overflow-auto"
        >
          <slot />
        </q-card-section>

        <div style="position: sticky; bottom: 0">
          <q-card-actions
            v-if="hasAction && !isFullscreen"
            :align="'right'"
            class="q-pt-none q-px-lg q-pb-lg q-gutter-x-md"
          >
            <slot name="actions" />
          </q-card-actions>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="sass">
.fullheight-dialog, .fullscreen-dialog
  .dialog-header
    color: black
  .q-dialog__inner
    padding: 0
  .q-dialog-plugin
    height: 100vh
    max-height: 100vh
    border-radius: 0
    max-width: 100vw

  .q-dialog__inner > div
    max-height: none !important

.fullheight-dialog
  .q-dialog-plugin
    width: clamp(300px, 50vw, 600px) !important

.fullscreen-dialog
  .q-dialog-plugin
    width: 100vw !important
</style>
