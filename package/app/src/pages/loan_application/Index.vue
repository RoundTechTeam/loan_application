<script setup lang="ts">
import { capitalCase } from 'change-case';
import dayjs from 'dayjs';
import { getCountryCallingCode } from 'libphonenumber-js';
import { Dialog } from 'quasar';
import { Api } from 'src/api';
import { AppTable, IconButton } from 'src/components';
import { TableColumn } from 'src/components/type';
import { useLoading } from 'src/composable';
import { useUserStore } from 'src/stores/user';
import { computed, onMounted, ref } from 'vue';
import { dateTimeFormat, LoanApplicationDetail } from '~libs/entities';
import { ApplicationStatus } from '~libs/entities/enums';
import { formatCurrency } from '~libs/helpers';
import LoanApplicationDialog from './LoanApplicationDialog.vue';

const { run, loading } = useLoading();
const user = useUserStore();

const data = ref<LoanApplicationDetail[]>([]);
const columns = computed<TableColumn<LoanApplicationDetail>[]>(() => [
  {
    name: 'actions',
    label: 'Actions',
    field: (v) => v,
    hide: !user.isAdmin,
  },
  {
    name: 'applied_at',
    label: 'Applied At',
    field: (v) => v.loan_applied_at,
    format: (v) => dayjs(v).format(dateTimeFormat),
  },
  {
    name: 'loan',
    label: 'Loan',
    field: (v) => v.Loan.name,
  },
  {
    name: 'status',
    label: 'Status',
    field: (v) => v.status,
  },
  {
    name: 'business_name',
    label: 'Business Name',
    field: (v) => v.business_name,
  },
  {
    name: 'view',
    label: 'View',
    field: (v) => v.file_path,
  },
  {
    name: 'username',
    label: 'Username',
    field: (v) => v.applied_by.full_name,
    hide: !user.isAdmin,
  },
  {
    name: 'contact_no',
    label: 'Contact No',
    field: (v) => v,
    format: (v) =>
      `+${getCountryCallingCode(v.applied_by.country_code)}${
        v.applied_by.contact_no
      }`,
    hide: !user.isAdmin,
  },
  {
    name: 'approved_loan_amount',
    label: 'Approved Loan Amount',
    field: (v) => v.approved_loan_amount,
    format: (v) => (v ? formatCurrency(v) : '-'),
    hide: !user.isAdmin,
  },
]);

function viewApplication(application: LoanApplicationDetail) {
  Dialog.create({
    component: LoanApplicationDialog,
    componentProps: {
      application,
    },
  }).onOk(() => fetchLoanApplications());
}

function getStatusColor(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.PENDING:
      return 'yellow-8';
    case ApplicationStatus.APPROVED:
      return 'green-5';
    case ApplicationStatus.REJECTED:
      return 'red-5';
    default:
      return 'primary';
  }
}

function goToUrl(url: string) {
  window.open(url, '_blank');
}

function fetchLoanApplications() {
  run(
    async () => {
      data.value = await Api.Loan.getLoanApplications();
    },
    {
      isLoading: loading,
    }
  );
}

onMounted(() => fetchLoanApplications());
</script>

<template>
  <q-page padding class="q-gutter-y-md">
    <div>
      <AppTable
        :option="{
          columns,
          data,
        }"
        :loading="loading"
        style="height: 80vh"
      >
        <template #actions="{ row }">
          <q-td>
            <IconButton @click="viewApplication(row)" icon="edit" />
          </q-td>
        </template>

        <template #view="v">
          <q-td>
            <icon-button
              v-if="v.value"
              icon="visibility"
              color="primary"
              size="md"
              @click="goToUrl(v.value)"
            />
            <icon-button
              v-else
              icon="visibility_off"
              color="grey"
              size="md"
              disable
            />
          </q-td>
        </template>

        <template #status="{ value }">
          <q-td>
            <q-badge
              :color="getStatusColor(value)"
              :label="capitalCase(value)"
            />
          </q-td>
        </template>
      </AppTable>
    </div>
  </q-page>
</template>
