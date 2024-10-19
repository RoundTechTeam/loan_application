<script setup lang="ts">
import { AppForm, PasswordInput, PrimaryButton } from 'src/components';
import CountryInput from 'src/components/CountryInput.vue';
import { useLoading, useResponsive } from 'src/composable';
import { AppRoute } from 'src/router/routes';
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PhoneDetails } from '~libs/entities';
import { ECountryCodeP } from '~libs/entities/enums';
import { validate } from '~libs/helpers';

const { isMobile } = useResponsive();
const { toast } = useLoading();
const user = useUserStore();
const app = useAppStore();
const router = useRouter();

const hover = ref(false);
const loginDto = reactive<{
  phone: PhoneDetails;
  password: string;
}>({
  phone: {
    contact_no: '',
    country_code: 'MY',
  },
  password: '',
});
const loading = ref(false);

async function login() {
  await toast(
    async () => {
      loginDto.phone.country_code = app.selectedCountry.code as ECountryCodeP;

      await user.login(
        {
          contact_no: loginDto.phone.contact_no,
          country_code: loginDto.phone.country_code,
        },
        loginDto.password
      );
      if (user.currentUser) {
        if (user.isAdmin)
          router.push({
            name: AppRoute.AdminDashboard,
          });
        else
          router.push({
            name: AppRoute.UserDashboard,
          });
      }
    },
    {
      isLoading: loading,
      message: 'Logging in...',
      successMessage: 'Login successful',
    }
  );
}

function signUp() {
  router.push({
    name: AppRoute.Register,
  });
}
</script>

<template>
  <div class="q-gutter-y-lg">
    <div class="q-gutter-y-sm text-center">
      <q-img
        src="/images/general_uses/loan_logo.jpg"
        width="180px"
        height="180px"
      />
      <div class="text-bold" :class="isMobile ? 'text-h4' : 'text-h2'">
        Login
      </div>
      <div class="text-grey-6 text-subtitle1"></div>
    </div>
    <q-form class="q-gutter-y-md" @submit="login" :loading="loading">
      <AppForm required title="Contact No">
        <q-input
          title="Phone No"
          type="number"
          dense
          outlined
          hide-bottom-space
          v-model="loginDto.phone.contact_no"
          :debounce="500"
          required
          :rules="[
            (v) => (v && v.length > 0) || 'Phone No cannot be empty',
            (v) =>
              validate.phoneNo(v, app.selectedCountry.code) ||
              `Please enter a valid ${app.selectedCountry.code} number`,
          ]"
        >
          <template #before>
            <CountryInput v-model="app.selectedCountry" />
          </template>
        </q-input>
      </AppForm>
      <password-input
        type="password"
        v-model="loginDto.password"
        title="Password"
        required
        :rules="[
          (val) => (val !== null && val !== '') || 'Password cannot be empty',
        ]"
      />

      <div class="full-width">
        <primary-button
          color="primary"
          label="Login"
          type="submit"
          text-color="white"
          :loading="loading"
          btn-class="full-width"
        />
      </div>
    </q-form>
    <div class="column q-gutter-y-sm">
      <div class="text-center text-subtitle1"></div>
      <q-separator />

      <div class="column">
        <div class="text-center text-subtitle1">
          <p @click="signUp">
            Sign up for a
            <span
              @mouseover="hover = true"
              @mouseleave="hover = false"
              :class="hover ? 'text-blue-6' : 'text-primary'"
              class="text-weight-bold cursor-pointer"
              >Demo Account</span
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
