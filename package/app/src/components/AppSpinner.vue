<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: 'Loading',
  },
  color: {
    type: String,
    default: 'primary',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '3em',
  },
  loadingHideComponent: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="relative-position fit" style="border-radius: inherit">
    <div class="fit overflow-auto" style="padding: 1px 0">
      <div
        :class="{
          invisible: loadingHideComponent && loading,
          'no-pointer-events': loading,
        }"
        class="fit"
      >
        <slot />
      </div>

      <q-inner-loading
        :showing="loading"
        style="border-radius: inherit; z-index: 2500"
      >
        <div class="column items-center">
          <q-spinner-oval :color="color" :size="size" />
          <div v-if="message?.trim()" class="q-mt-sm t-body">
            {{ message }}
          </div>
        </div>
      </q-inner-loading>
    </div>
  </div>
</template>
