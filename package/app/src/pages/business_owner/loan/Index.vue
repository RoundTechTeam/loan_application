<script setup lang="ts">
import dayjs from 'dayjs';
import { Dialog } from 'quasar';
import { Api } from 'src/api';
import { AppTable, IconButton, PrimaryButton } from 'src/components';
import { TableColumn } from 'src/components/type';
import { useLoading } from 'src/composable';
import { computed, onMounted, ref } from 'vue';
import { dateFormat, Loan } from '~libs/entities';
import LoanDialog from './dialog/LoanDialog.vue';

const { loading, run } = useLoading();

const data = ref<Loan[]>([]);
const columns = computed<TableColumn<Loan>[]>(() => [
  {
    name: 'actions',
    label: 'Actions',
    field: (v) => v,
  },
  {
    name: 'created_at',
    label: 'Created At',
    field: (v) => v.created_at,
    format: (v) => dayjs(v).format(dateFormat),
  },
  {
    name: 'name',
    label: 'Name',
    field: (v) => v.name,
  },
  {
    name: 'start_at',
    label: 'Start At',
    field: (v) => v.start_at,
    format: (v) => dayjs(v).format(dateFormat),
  },
  {
    name: 'end_at',
    label: 'End At',
    field: (v) => v.end_at,
    format: (v) => dayjs(v).format(dateFormat),
  },
  {
    name: 'loan_amount',
    label: 'Loan Amount (Min - Max)',
    field: (v) => v,
    format: (v) => `${v.mininum_loan_amount} - ${v.maximum_loan_amount}`,
  },
]);

function createLoan() {
  Dialog.create({
    component: LoanDialog,
  }).onOk(() => fetchLoans());
}

function updateLoan(loan: Loan) {
  Dialog.create({
    component: LoanDialog,
    componentProps: {
      loan,
    },
  }).onOk(() => fetchLoans());
}

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
      <PrimaryButton label="Create Loan" @click="createLoan" />
    </div>
    <div>
      <AppTable
        :option="{
          columns,
          data,
        }"
      >
        <template #actions="{ row }">
          <q-td>
            <IconButton @click="updateLoan(row)" icon="edit" />
          </q-td>
        </template>
      </AppTable>
    </div>
  </q-page>
</template>
