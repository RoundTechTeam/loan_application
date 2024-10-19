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
      <div class="col-md-3 col-sm-4 col-12">
        <LoanCard v-for="(loan, i) in data" :key="i" :loan="loan" />
      </div>
    </div>
  </q-page>
</template>
