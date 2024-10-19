<script setup lang="ts">
import { AppSpinner } from 'src/components';
import { useResponsive } from 'src/composable';
import { computed, ref } from 'vue';

interface Announcement {
  id: number;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
}

const { lte } = useResponsive();

const loading = ref(false);
const announcements = ref<Announcement[]>([]);
const carouselContent = computed<Announcement[]>(() => buildCarouselContent());
const autoplay = ref(true);
const currentSlide = ref(carouselContent.value[0].id);
const canShowOverlay = computed(() => {
  const announcement = carouselContent.value.find(
    (a) => a.id === currentSlide.value
  );
  return announcement?.title && announcement?.description;
});

function buildCarouselContent(): Announcement[] {
  if (announcements.value.length > 0) {
    currentSlide.value = announcements.value[0].id;
    return announcements.value;
  } else {
    return [
      {
        id: 1,
        title: 'Welcome to RoundTech',
        description: 'A Loan application project',
        imageUrl: '/images/general_uses/background-image-1.jpg',
      },
    ];
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="bg">
    <q-page-container>
      <q-page>
        <div class="row full-height">
          <div class="col-sm-12 col-md-5 col-xs-12 full-height">
            <div
              class="row items-center justify-center full-height"
              style="min-height: 100vh"
            >
              <div
                class="col-lg-8 col-md-11 col-xs-10 q-py-lg"
                :class="{ 'q-px-md': lte.md }"
              >
                <router-view />
              </div>
              <div class="col-grow text-center">
                {{
                  `© ${new Date().getFullYear()} Company name Sdn Bhd. All rights reserved.`
                }}
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-7 col-xs-12 gt-sm" v-if="loading">
            <app-spinner loading message="Loading..." />
          </div>
          <div v-else class="col-sm-12 col-md-7 col-xs-12 gt-sm">
            <q-carousel
              v-model="currentSlide"
              class="text-white full-height"
              animated
              navigation
              infinite
              :autoplay="autoplay"
              arrows
              swipeable
              transition-prev="jump-right"
              transition-next="jump-left"
              dark
              padding
              @mouseenter="autoplay = false"
              @mouseleave="autoplay = true"
              style="min-height: 100vh"
            >
              <q-carousel-slide
                v-for="(c, i) in carouselContent"
                :key="i"
                :name="c.id"
                class="column flex-center no-wrap carousel-bg relative-position"
                :style="{
                  '--bg': `url(${c.imageUrl})`,
                  '--brightness': canShowOverlay ? 0.4 : 1,
                }"
                style="background-size: 100% 100%"
              >
                <div
                  v-if="canShowOverlay"
                  class="absolute-center"
                  style="width: 80%"
                >
                  <div class="q-gutter-y-lg">
                    <div class="text-h2 text-bold text-grey">
                      {{ c.title }}
                    </div>
                    <q-separator color="white" />
                    <div class="text-h6">{{ c.description }}</div>
                  </div>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style scoped lang="sass">
.carousel-bg
  &:before
    content: ''
    background-image: var(--bg)
    background-size: inherit
    background-repeat: no-repeat
    width: 100%
    height: 100%
    top: 0
    left: 0
    position: absolute
    filter: brightness(var(--brightness))
</style>
