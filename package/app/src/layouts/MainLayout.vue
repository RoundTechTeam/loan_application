<script setup lang="ts">
import { NavigationItem } from 'src/components/type';
import { useResponsive } from 'src/composable';
import { useRouting } from 'src/composable/router';
import router from 'src/router';
import { AppRoute } from 'src/router/routes';
import { computed, ref } from 'vue';

const { isActive } = useRouting();
const { isMobile } = useResponsive();

const leftDrawerOpen = ref(false);
const sidebarItems = computed<NavigationItem[]>(() => {
  return [
    {
      title: 'Dashboard',
      icon: 'home',
      route: AppRoute.Dashboard,
    },
    {
      title: 'Loan',
      icon: 'storefront',
      route: AppRoute.Loan,
    },
    // {
    //   title: 'Profile',
    //   icon: 'person',
    //   route: AppRoute.SignUp,
    // },
  ];
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function goto(route: NavigationItem['route'], query?: any) {
  if (typeof route === 'function') {
    await route();
  } else {
    if (query) {
      router.push({ name: route, query });
    } else {
      router.push({ name: route });
    }
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Loan Management App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area style="height: 100vh">
        <div class="column" style="height: 100vh">
          <q-list class="relative-position" style="padding-bottom: 150px">
            <q-item header class="items-center q-gutter-x-sm">
              <img src="logo_imagehere" style="width: 95%" />
            </q-item>

            <q-item
              v-for="(item, i) in sidebarItems"
              :key="i"
              :active="isActive(item.route as AppRoute)"
              active-class="text-black"
              :style="{
            'background-color': isActive(item.route as AppRoute) ? '#E9F5FE' : '',
          }"
              clickable
              class="q-mx-md"
              style="border-radius: 0.4rem"
              @click="
                !item.subItems?.length
                  ? goto(item.route, item.query)
                  : undefined
              "
            >
              <q-item-section v-if="item.icon" avatar>
                <q-icon :name="item.icon" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.title }}</q-item-label>
              </q-item-section>

              <q-menu
                v-if="item.subItems?.length"
                anchor="top right"
                :self="!isMobile ? 'top left' : 'top right'"
                style="width: 250px"
              >
                <q-list
                  class="bg-grey-10 text-grey-3 q-pa-md text-subtitle2 text-bold"
                >
                  <template v-for="(subItem, i) in item.subItems" :key="i">
                    <q-item
                      v-if="!subItem.subItems?.length"
                      clickable
                      v-close-popup
                      @click="goto(subItem.route)"
                    >
                      <q-item-section>{{ subItem.title }}</q-item-section>
                    </q-item>

                    <q-expansion-item v-else :label="subItem.title">
                      <q-item
                        v-for="(subSubItem, i) in subItem.subItems"
                        :key="i"
                        clickable
                        v-close-popup
                        @click="goto(subSubItem.route)"
                      >
                        <q-item-section>{{ subSubItem.title }}</q-item-section>
                      </q-item>
                    </q-expansion-item>
                  </template>
                </q-list>
              </q-menu>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
