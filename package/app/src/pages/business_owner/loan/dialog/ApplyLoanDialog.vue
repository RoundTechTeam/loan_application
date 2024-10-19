<script setup lang="ts">
import { capitalCase } from 'change-case';
import { Api } from 'src/api';
import {
  AppForm,
  DropdownInput,
  GlobalDialog,
  PrimaryButton,
  TextInput,
} from 'src/components';
import { useDialog, useLoading } from 'src/composable';
import { prompt } from 'src/plugins';
import { PropType, ref } from 'vue';
import { LoanApplicationDto } from '~api/loan/loan.dto';
import { Loan } from '~libs/entities';
import { CompanyType } from '~libs/entities/enums';

const props = defineProps({
  loan: {
    type: Object as PropType<Loan>,
    required: true,
  },
});

const { dialogRef, emitData } = useDialog();
const { loading, toast } = useLoading();

const state = ref<LoanApplicationDto>({
  is_malaysia_company: true,
  annual_sales: 0,
  company_type: CompanyType.PRIVATE_LIMITED,
  loan_id: props.loan.id,
  operation_year: 0,
  business_name: '',
});

function submit() {
  prompt
    .warningConfirmation({
      message: 'Are you sure you want to apply for this loan?',
      title: 'Apply Loan',
    })
    .onOk(() => {
      toast(
        async () => {
          await Api.Loan.applyLoan(state.value);
          emitData();
        },
        {
          isLoading: loading,
          message: 'Applying loan...',
          successMessage: 'Loan applied successfully! Please wait for approval',
        }
      );
    });
}
</script>

<template>
  <GlobalDialog
    ref="dialogRef"
    title="Apply Loan"
    padding="md"
    @submit="submit"
  >
    <div class="q-gutter-y-md">
      <AppForm title="Loan Name">
        <div>{{ loan.name }}</div>
      </AppForm>

      <TextInput v-model="state.business_name" title="Business Name" required />

      <TextInput
        v-model="state.operation_year"
        title="Operation Year"
        type="number"
        :number="{
          decimal: 0,
          min: 1,
        }"
      />

      <DropdownInput
        v-model="state.company_type"
        :options="
          Object.keys(CompanyType).map((v) => ({
            label: capitalCase(v),
            value: v,
          }))
        "
        title="Company Type"
      />

      <TextInput
        v-model="state.annual_sales"
        title="Annual Sales"
        type="number"
        :number="{
          decimal: 2,
          min: 1,
        }"
      />

      <AppForm title="Is Malaysia Company">
        <q-toggle
          v-model="state.is_malaysia_company"
          label="Is Malaysia Company"
        />
      </AppForm>
    </div>

    <template #actions>
      <PrimaryButton label="Submit" type="submit" />
    </template>
  </GlobalDialog>
</template>
