<script setup lang="ts">
import { capitalCase } from 'change-case';
import { Api } from 'src/api';
import {
  AppForm,
  GlobalDialog,
  PrimaryButton,
  TextInput,
} from 'src/components';
import { useDialog, useLoading } from 'src/composable';
import { prompt } from 'src/plugins';
import { PropType, reactive } from 'vue';
import { UpdateLoanApplicationDto } from '~api/loan/loan.dto';
import { LoanApplicationDetail } from '~libs/entities';
import { ApplicationStatus } from '~libs/entities/enums';
import { formatCurrency } from '~libs/helpers';

const props = defineProps({
  application: {
    type: Object as PropType<LoanApplicationDetail>,
    required: true,
  },
});

const { dialogRef, emitData } = useDialog();
const { loading, toast } = useLoading();

const state = reactive<UpdateLoanApplicationDto>({
  id: props.application.id,
  status: props.application.status,
  approved_loan_amount: props.application.approved_loan_amount,
});

const statusOptions = Object.keys(ApplicationStatus).reduce<
  {
    label: string;
    value: string;
  }[]
>((pv, cv) => {
  if (cv === ApplicationStatus.PENDING) return pv;
  return [...pv, { label: capitalCase(cv), value: cv as ApplicationStatus }];
}, []);

async function submit() {
  prompt
    .warningConfirmation({
      title: 'Confirm',
      message: `Are you sure you want to ${
        state.status === ApplicationStatus.APPROVED ? 'approve' : 'reject'
      } this application?`,
    })
    .onOk(() => {
      toast(
        async () => {
          await Api.Loan.updateLoanApplication(state);
          emitData();
        },
        {
          isLoading: loading,
          message: 'Updating...',
          successMessage: 'Updated successfully',
        }
      );
    });
}
</script>

<template>
  <GlobalDialog
    ref="dialogRef"
    title="Loan Application"
    padding="md"
    @submit="submit"
  >
    <div class="q-gutter-y-md">
      <AppForm title="Business Name">
        <div>{{ application.business_name }}</div>
      </AppForm>

      <AppForm title="Company Type">
        <div>{{ capitalCase(application.company_type) }}</div>
      </AppForm>

      <AppForm title="Is Malaysia Company">
        <div>{{ application.is_malaysia_company ? 'Yes' : 'No' }}</div>
      </AppForm>

      <AppForm title="Annual Sales">
        <div>{{ formatCurrency(application.annual_sales) }}</div>
      </AppForm>

      <q-btn-toggle
        v-model="state.status"
        :toggle-color="
          state.status === ApplicationStatus.APPROVED ? 'positive' : 'negative'
        "
        :disable="application.status !== ApplicationStatus.PENDING"
        no-caps
        spread
        :options="statusOptions"
      />

      <TextInput
        v-if="state.status === ApplicationStatus.APPROVED"
        v-model="state.approved_loan_amount"
        title="Approve Loan Amount"
        type="number"
        :disable="application.status !== ApplicationStatus.PENDING"
        :number="{
          decimal: 2,
          max: props.application.Loan.maximum_loan_amount,
          min: props.application.Loan.mininum_loan_amount,
        }"
      />
    </div>

    <template v-if="application.status === ApplicationStatus.PENDING" #actions>
      <PrimaryButton
        label="Submit"
        type="submit"
        :disable="state.status === ApplicationStatus.PENDING"
      />
    </template>
  </GlobalDialog>
</template>
