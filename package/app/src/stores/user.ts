import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PhoneDetails, UserWithoutPassword } from '~libs/entities';
import { Api, ApiError } from '../api';
import { useAppStore } from './app';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: useLocalStorage<string | null>('access-token', null),
    currentUser: ref<UserWithoutPassword | null>(null),
    connectionLost: ref(false),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.currentUser?.is_admin ?? false,
  },
  actions: {
    async refetch(): Promise<void> {
      if (!this.token) return;
      useAppStore().addLoadingQueues([{ id: 'user', isGlobal: true }]);
      try {
        this.currentUser = await Api.User.fetchUser();

        if (this.currentUser?.id) this.connectionLost = false;
      } catch (e) {
        if (e instanceof ApiError && e.statusCode === 401) {
          this.token = null;
        } else {
          this.connectionLost = true;
        }
        throw e;
      } finally {
        useAppStore().resolveQueues(['user']);
      }
    },
    async login(phoneDetails: PhoneDetails, password: string): Promise<void> {
      try {
        const resp = await Api.User.login({
          contact_no: phoneDetails.contact_no,
          country_code: phoneDetails.country_code,
          password,
        });
        this.token = resp.data.token;
        await this.refetch();
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.statusCode === 401) {
            throw new Error(e.message);
          } else if (e.statusCode === 403) {
            throw new Error('You are not authorized to access this page');
          } else {
            this.connectionLost = true;
          }
        }
        throw e;
      }
    },
    async loginUsingToken(token: string): Promise<void> {
      this.token = token;
      await this.refetch();
    },
    async logout(): Promise<void> {
      try {
        await Api.User.logout();
      } finally {
        //TBC this sohai token
        this.token = null;
        this.currentUser = null;
        window.location.reload();
      }
    },
  },
});
