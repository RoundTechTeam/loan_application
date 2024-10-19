<script setup lang="ts">
import { useUserStore } from 'src/stores/user';
import { buildPhoneNumber } from '~libs/helpers';

const user = useUserStore();

console.log('user', user.currentUser);
// onMounted(()=> user.)
</script>

<template>
  <div class="q-pa-xl">
    <!-- shadow div -->
    <div class="shadow-5 q-pa-md">
      <div class="row items-center justify-between">
        <div class="col">
          <div class="text-h4">Profile</div>
          <div class="text-subtitle1">
            {{ user.currentUser?.full_name }}
          </div>
          <div class="q-my-md text-subtitle1">
            Full Name: {{ user.currentUser?.full_name }}
          </div>
          <div class="q-my-md text-subtitle1">
            Contact Number:
            {{
              buildPhoneNumber(
                user.currentUser?.country_code ?? 'MY',
                user.currentUser?.contact_no ?? ''
              )
            }}
          </div>
          <div class="q-my-md text-subtitle1">
            Admin: {{ user.currentUser?.is_admin ? 'Yes' : 'No' }}
          </div>
          <div class="q-my-md text-subtitle1">
            Account Status:
            {{ user.currentUser?.is_verified ? 'Verified' : 'not yet' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
