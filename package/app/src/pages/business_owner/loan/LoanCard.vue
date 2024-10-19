<script setup lang="ts">
import { PrimaryButton } from 'src/components';
import { PropType } from 'vue';
import { Loan } from '~libs/entities';

defineProps({
  loan: {
    type: Object as PropType<Loan>,
    required: true,
  },
});
</script>

<template>
  <q-card square>
    <q-img
      src="/images/loan-01.jpg"
      :img-style="{
        filter: 'opacity(90%)',
      }"
    >
      <div class="absolute-bottom text-subtitle2">
        <div class="q-gutter-y-md">
          <div class="text-black text-h5 text-bold">{{ loan.name }}</div>
          <PrimaryButton label="Apply" />
        </div>
      </div>
    </q-img>

    <!-- <q-card-section>
      <PrimaryButton label="Apply" />
    </q-card-section> -->
  </q-card>
</template>

<style lang="sass" scoped>
.q-img__content > div
  background: rgb(255,255,255,0.6)
  box-shadow: 0 0 5px #ccc
</style>
