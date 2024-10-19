<script setup lang="ts">
import { computed, watch } from 'vue';
import { useAppStore } from './stores/app';
import { Loading, QSpinnerFacebook, useMeta } from 'quasar';
import { useRoute } from 'vue-router';
import { capitalCase } from 'change-case';
import { Toaster, ToasterProps } from 'vue-sonner';

const route = useRoute();
const appStore = useAppStore();

const isLoading = computed(
  () => appStore.loadingQueue.filter((queue) => queue.isGlobal).length > 0
);

const toasterOptions: ToasterProps = {
  position: 'top-right',
  visibleToasts: 3,
  expand: true,
  richColors: true,
};

watch(
  () => isLoading.value,
  (v) => {
    if (v) {
      Loading.show({
        spinner: QSpinnerFacebook,
        spinnerSize: 120,
        group: 'global',
        spinnerColor: 'primary',
        message: 'Loading...',
        messageColor: 'white',
        customClass: 'text-weight-medium text-h5',
      });
    } else {
      Loading.hide('global');
    }
  },
  { immediate: true }
);

useMeta(() => {
  return {
    title: route.name ? capitalCase(route.name as string) : undefined,
    titleTemplate: (title) => {
      return `${title ? `${title} | ` : ''}${process.env.APP_TITLE}`;
    },
  };
});
</script>

<template>
  <Toaster v-bind="toasterOptions" />
  <router-view />
</template>

<style lang="sass">
@import url("https://fonts.googleapis.com/css?family=Noto Sans:400,500,600,700")
@import "./styles/app"
@import "./styles/border"
@import "./styles/color"
@import "./styles/typo"

#app
  font-size: 14px
  font-family: "Noto Sans", sans-serif
</style>
