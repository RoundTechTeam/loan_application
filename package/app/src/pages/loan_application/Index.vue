<script setup lang="ts">
import { capitalCase } from 'change-case';
import dayjs from 'dayjs';
import { Api } from 'src/api';
import { AppTable, IconButton } from 'src/components';
import { TableColumn } from 'src/components/type';
import { useLoading } from 'src/composable';
import { computed, onMounted, ref } from 'vue';
import { dateTimeFormat, LoanApplicationDetail } from '~libs/entities';
import { ApplicationStatus } from '~libs/entities/enums';

const { run, loading } = useLoading();

const data = ref<LoanApplicationDetail[]>([]);
const columns = computed<TableColumn<LoanApplicationDetail>[]>(() => [
  {
    name: 'actions',
    label: 'Actions',
    field: (v) => v,
  },
  {
    name: 'applied_at',
    label: 'Applied At',
    field: (v) => v.loan_applied_at,
    format: (v) => dayjs(v).format(dateTimeFormat),
  },
  {
    name: 'status',
    label: 'Status',
    field: (v) => v.status,
  },
  {
    name: 'username',
    label: 'Username',
    field: (v) => v.applied_by.full_name,
  },
  {
    name: 'contact_no',
    label: 'Contact No',
    field: (v) => v,
    format: (v) => `+${v.applied_by.country_code}${v.applied_by.contact_no}`,
  },
  {
    name: 'loan',
    label: 'Loan',
    field: (v) => v.loan_applied_at,
  },
]);

function viewApplication(application: LoanApplicationDetail) {
  console.log('view application', application);
}

function getStatusColor(status: ApplicationStatus) {
  switch (status) {
    case ApplicationStatus.PENDING:
      return 'yellow-7';
    case ApplicationStatus.APPROVED:
      return 'green-5';
    case ApplicationStatus.REJECTED:
      return 'red-5';
    default:
      return 'primary';
  }
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
      >
        <template #actions="{ row }">
          <q-td>
            <IconButton @click="viewApplication(row)" icon="edit" />
          </q-td>
        </template>

        <template #status="{ value }">
          <q-badge :color="getStatusColor(value)" :label="capitalCase(value)" />
        </template>
      </AppTable>
    </div>
  </q-page>
</template>
