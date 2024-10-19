<script setup lang="ts">
import { Dialog } from 'quasar';
import { IconButton, PrimaryButton } from 'src/components';
import { PropType } from 'vue';
import { Loan } from '~libs/entities';
import LoanDialog from './dialog/LoanDialog.vue';

const props = defineProps({
  loan: {
    type: Object as PropType<Loan>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

function viewLoan() {
  Dialog.create({
    component: LoanDialog,
    componentProps: {
      loan: props.loan,
    },
  });
}
</script>

<template>
  <q-card square>
    <q-img
      :src="`/images/loan-0${index % 2 === 0 ? 1 : 2}.jpg`"
      :img-style="{
        filter: 'opacity(90%)',
      }"
    >
      <div style="position: absolute; right: 0px; background: none">
        <IconButton icon="info" @click="viewLoan" color="primary" size="md" />
      </div>
      <div class="absolute-bottom text-subtitle2">
        <div class="q-gutter-y-sm">
          <div class="text-black text-h6 text-bold">
            {{ loan.name }}
          </div>
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
.q-img__content > div.absolute-bottom
  background: rgb(255,255,255,0.6)
  box-shadow: 0 0 5px #ccc
  padding: 10px
</style>
