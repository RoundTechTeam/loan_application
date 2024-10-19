<script setup lang="ts">
import { Api } from 'src/api';
import TextInput from 'src/components/form/TextInput.vue';
import { useLoading, useResponsive } from 'src/composable';
import { AppRoute } from 'src/router/routes';
import { useAppStore } from 'src/stores/app';
import { useUserStore } from 'src/stores/user';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { buildPhoneNumber } from '~libs/helpers';

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

const state = reactive<{ verificationCode: number | null }>({
  verificationCode: null,
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
      //   const statusCode = await Api.User.register(state);
    },
    {
      isLoading: loading,
      message: 'Signing you in',
      successMessage: 'Welcome to Demo!',
    }
  );
}

async function submit() {
  if (state.verificationCode === null || state.verificationCode === 0) return;
  const verified = await Api.User.verifyUserAccount({
    verificationCode: state.verificationCode,
  });
  router.push({
    name: AppRoute.UserDashboard,
  });

  console.log('verified', verified);

  if (verified) {
    router.push({
      name: AppRoute.UserDashboard,
    });
    window.location.reload();
  }
}

async function resendCode() {
  await Api.User.resendCode();
}

onMounted(() => {
  user.refetch();
});
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
                  class="q-gutter-y-xs q-pt-md full-height full-width"
                  style="align-content: center"
                  @submit="signUp"
                  :loading="loading"
                >
                  <div class="row col-12 justify-center">
                    <p class="text-h4 text-bold">
                      <span class="self-center"
                        >Verified code for you Demo Account</span
                      >
                    </p>
                  </div>
                  <div class="row col-12 text-subtitle1 justify-center">
                    <p>
                      {{
                        `Enter your verification code from
                      +${buildPhoneNumber(
                        user.currentUser?.country_code ?? 'MY',
                        user.currentUser?.contact_no ?? ''
                      )}`
                      }}
                    </p>
                    <TextInput
                      v-model="state.verificationCode"
                      required
                      type="number"
                      class="col-8"
                      placeholder="Verification Code"
                    />

                    <q-btn
                      label="Resend"
                      @click="resendCode()"
                      color="dark"
                      size="md"
                      class="col-4"
                      style="align-self: end; height: 25px"
                    />
                  </div>

                  <q-separator color="text-grey-9" class="q-mt-sm" />

                  <q-btn
                    label="Submit Code"
                    @click="submit"
                    color="primary"
                    size="md"
                    class="full-width q-my-sm col-3"
                  />

                  <p class="text-center q-my-sm">
                    <span
                      class="cursor-pointer text-weight-bold"
                      style="color: blue; text-decoration-line: underline"
                      @click="user.logout()"
                      >Back To Login Page?
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
