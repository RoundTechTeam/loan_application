<script setup lang="ts">
import { Api } from 'src/api';
import { PasswordInput } from 'src/components';
import PrimaryButton from 'src/components/buttons/PrimaryButton.vue';
import CountryInput from 'src/components/CountryInput.vue';
import AppForm from 'src/components/form/AppForm.vue';
import TextInput from 'src/components/form/TextInput.vue';
import { useLoading, useResponsive } from 'src/composable';
import { AppRoute } from 'src/router/routes';
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RegisterUserDto } from '~api/auth/auth.dto';
import { ECountryCodeP } from '~libs/entities/enums';
import { validate } from '~libs/helpers';

interface Feature {
  title: string;
  icon: string;
}

const { lte, isMobile } = useResponsive();
const { toast, run } = useLoading();
const user = useUserStore();
const app = useAppStore();
const router = useRouter();
const route = useRoute();

const state = reactive<RegisterUserDto & { confirmPassword: string }>({
  full_name: '',
  contact_no: '',
  country_code: 'MY',
  password: '',
  confirmPassword: '',
});
const loading = ref(false);

function gotoSignIn() {
  router.push({
    name: AppRoute.Login,
  });
}

async function signUp() {
  await toast(
    async () => {
      const statusCode = await Api.User.register(state);

      if (statusCode === 201) {
        //Register Successful, then login
        await user.login(
          {
            contact_no: state.contact_no,
            country_code: app.selectedCountry.code as ECountryCodeP,
          },
          state.password
        );
        (window as any).Login?.postMessage(user.token);
        if (user.currentUser) {
          router.push({
            name: AppRoute.Dashboard,
            query: {
              alias: route.query.alias,
            },
          });
        }
      }
    },
    {
      isLoading: loading,
      message: 'Signing you in',
      successMessage: 'Welcome to DREAMZTRACK!',
    }
  );
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page>
        <div
          class="row q-pa-md items-center justify-center"
          style="
            height: 100vh;
            background-image: url('/images/general_uses/background-image-1.jpg');
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            background-color: rgba(0, 0, 0);
          "
        >
          <div
            class="row rounded-borders full-width"
            style="height: 100%"
            :style="
              isMobile
                ? { paddingRight: '5px', paddingLeft: '5px' }
                : { paddingRight: '10%', paddingLeft: '10%' }
            "
          >
            <div
              class="col-7 col-lg-6 gt-sm q-pa-lg text-white shadow-12"
              style="
                background-color: rgba(40, 166, 242, 0.4);
                border-top-left-radius: 16px;
                border-bottom-left-radius: 16px;
                height: 100%;
              "
            >
              <div class="row fit">
                <div
                  class="col-xs-10 col-lg-11 col-md-11 q-py-md center"
                  style="align-content: center"
                >
                  <div class="row">
                    <q-img
                      src="/images/general_uses/background-image-2.png"
                      height="100%"
                      width="100%"
                      style=""
                    />
                  </div>
                  <div class="col q-pt-md"></div>
                </div>
              </div>
            </div>
            <div
              class="col-12 col-md-5 col-lg-6"
              style="
                border-top-right-radius: 16px;
                border-bottom-right-radius: 16px;
              "
            >
              <div
                class="col bg-white q-py-md q-px-lg full-height justify-center items-center self-center"
                :style="
                  lte.sm
                    ? {
                        borderRadius: '16px',
                      }
                    : {
                        borderTopRightRadius: '16px',
                        borderBottomRightRadius: '16px',
                      }
                "
              >
                <q-form
                  class="q-gutter-y-xs q-pt-md full-height"
                  style="align-content: center"
                  @submit="signUp"
                  :loading="loading"
                >
                  <p class="text-h5 text-bold">
                    <q-icon name="fas fa-user" size="sm"></q-icon>
                    <span class="self-center"
                      >Registering as a Demo Account</span
                    >
                  </p>

                  <TextInput
                    v-model="state.full_name"
                    title="Full name"
                    required
                  />

                  <AppForm required title="Contact No">
                    <q-input
                      title="Phone No"
                      type="number"
                      dense
                      outlined
                      hide-bottom-space
                      v-model="state.contact_no"
                      :debounce="500"
                      required
                      :rules="[
                        (v) =>
                          (v && v.length > 0) || 'Phone No cannot be empty',
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

                  <PasswordInput
                    type="password"
                    v-model="state.password"
                    title="Password"
                    required
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Password cannot be empty',
                    ]"
                  />

                  <PasswordInput
                    type="password"
                    v-model="state.confirmPassword"
                    title="Confirm Password"
                    required
                    :rules="[
                      (val) =>
                        val === state.password || 'Passwords do not match',
                    ]"
                  />
                  <div class="full-width q-pt-md">
                    <PrimaryButton
                      color="primary"
                      label="Create your DREAMZTRACK Account"
                      type="submit"
                      text-color="white"
                      :loading="loading"
                      btn-class="full-width"
                    />
                  </div>

                  <q-separator color="text-grey-9" class="q-mt-sm" />

                  <p class="text-center">
                    Already have an account ?
                    <span
                      class="cursor-pointer text-weight-bold"
                      @click="gotoSignIn"
                    >
                      Sign In Demo Account
                    </span>
                  </p>
                </q-form>

                <q-separator color="black" />
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
