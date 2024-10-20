<script setup lang="ts">
import dayjs from 'dayjs';
import { Dialog } from 'quasar';
import { Api } from 'src/api';
import { AppTable, IconButton, PrimaryButton } from 'src/components';
import { TableColumn } from 'src/components/type';
import { useLoading } from 'src/composable';
import { prompt } from 'src/plugins';
import { computed, onMounted, ref } from 'vue';
import { dateFormat, Loan } from '~libs/entities';
import LoanDialog from './dialog/LoanDiaog.vue';

const { loading, run, toast } = useLoading();

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

function deleteLoan(loan: Loan) {
  prompt
    .deleteConfirmation({
      title: 'Delete Loan',
      message: `Are you sure you want to delete ${loan.name}?`,
    })
    .onOk(() => {
      toast(
        async () => {
          await Api.Loan.deleteLoan(loan.id);
        },
        {
          isLoading: loading,
          message: 'Deleting...',
          successMessage: 'Deleted successfully',
        }
      );
    });
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
        :loading="loading"
        style="height: 75vh"
      >
        <template #actions="{ row }">
          <q-td class="row">
            <IconButton @click="updateLoan(row)" icon="edit" />
            <!-- <IconButton @click="deleteLoan(row)" icon="delete" color="red" /> -->
          </q-td>
        </template>
      </AppTable>
    </div>
  </q-page>
</template>
