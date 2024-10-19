<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div class="form-wrapper relative-position">
    <div v-if="title" class="wrapper-legend text-bold text-subtitle1 q-pb-md">
      {{ title }}
    </div>
    <div class="q-gutter-y-md q-pt-md">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="sass">
.wrapper-legend
  position: absolute
  top: -8px
  line-height: 1
  background: white
  color: black
  z-index: 10
  padding: 1px 5px
</style>
