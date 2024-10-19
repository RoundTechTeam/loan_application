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
    //format: (v) => `${v.min_loan_amount} - ${v.max_loan_amount}`,
  },
  {
    name: 'min_operation_year',
    label: 'Min Operation Year',
    field: (v) => v.min_operation_year,
  },
  {
    name: 'valid_company_type',
    label: 'Valid Company Type',
    field: (v) => v.valid_company_type,
  },
  {
    name: 'min_annual_sales',
    label: 'Min Annual Sales',
    field: (v) => v.min_annual_sales,
  },
  {
    name: 'is_malaysia_company',
    label: 'Is Malaysia Company',
    field: (v) => v.is_malaysia_company,
  },
  {
    name: 'instalment_tenure_year',
    label: 'Instalment Tenure Year',
    field: (v) => v.instalment_tenure_year,
  },
  {
    name: 'interest_rate',
    label: 'Interest Rate',
    field: (v) => v.interest_rate,
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
