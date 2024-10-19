<script setup lang="ts">
import { Api } from 'src/api';
import { useLoading } from 'src/composable';
import { onMounted, ref } from 'vue';
import { Loan } from '~libs/entities';
import LoanCard from './LoanCard.vue';

const { loading, run } = useLoading();

const data = ref<Loan[]>([]);

function fetchLoans() {
  run(
    async () => {
      data.value = await Api.Loan.getLoans();
    },
    {
      isLoading: loading,
    }
  );
}

onMounted(() => fetchLoans());
</script>

<template>
  <q-page padding class="q-gutter-y-md">
    <div class="row items-center">
      <div
        v-for="(loan, i) in data"
        :key="i"
        class="col-lg-2 col-md-3 col-sm-4 col-6 q-pa-sm"
      >
        <LoanCard :loan="loan" :index="i" />
      </div>
    </div>
  </q-page>
</template>
