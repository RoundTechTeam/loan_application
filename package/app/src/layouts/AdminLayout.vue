<script setup lang="ts">
import { NavigationItem } from 'src/components/type';
import { useResponsive } from 'src/composable';
import { useRouting } from 'src/composable/router';
import router from 'src/router';
import { AppRoute } from 'src/router/routes';
import { useUserStore } from 'src/stores/user';
import { computed, ref } from 'vue';

const { isActive } = useRouting();
const { isMobile } = useResponsive();
const user = useUserStore();

const leftDrawerOpen = ref(false);
const sidebarItems = computed<NavigationItem[]>(() => {
  return [
    {
      title: 'Dashboard',
      icon: 'home',
      route: AppRoute.AdminDashboard,
    },
    {
      title: 'Loan',
      icon: 'storefront',
      route: AppRoute.AdminLoan,
    },
    {
      title: 'Loan Application',
      icon: 'description',
      route: AppRoute.AdminLoanApplication,
    },
  ];
});
const userMenuItems = computed<NavigationItem[]>(() => {
  return [
    {
      title: 'Profile',
      icon: 'person',
      route: AppRoute.AdminProfile,
    },
    {
      title: 'Logout',
      icon: 'logout',
      route: async () => {
        try {
          await user.logout();
          console.log('logout done');
        } finally {
          router.push({ name: AppRoute.Login });
        }
      },
    },
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
      <q-toolbar class="row justify-between">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <div>
          <q-btn
            icon="person"
            :label="user.currentUser?.full_name"
            flat
            outline
            no-caps
          >
            <q-menu auto-close self="top right" anchor="bottom right">
              <q-list>
                <q-item
                  v-for="(item, i) in userMenuItems"
                  :key="i"
                  clickable
                  @click="goto(item.route)"
                >
                  <q-item-section avatar>
                    <q-icon :name="item.icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ item.title }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area style="height: 100vh">
        <div class="column" style="height: 100vh">
          <q-list class="relative-position" style="padding-bottom: 150px">
            <q-item header class="items-center q-gutter-x-sm justify-center">
              <img
                src="/images/general_uses/loan_logo.jpg"
                style="width: 130px; max-height: 130px"
              />
            </q-item>

            <q-item
              v-for="(item, i) in sidebarItems"
              :key="i"
              :active="isActive(item.route as AppRoute, true)"
              active-class="text-black"
              :style="{
              'background-color': isActive(item.route as AppRoute, true) ? '#E9F5FE' : '',
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
