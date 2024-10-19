<script setup lang="ts">
import { capitalCase } from 'change-case';
import dayjs from 'dayjs';
import { Api } from 'src/api';
import {
  AppForm,
  DateRangePicker,
  GlobalDialog,
  PrimaryButton,
  TextInput,
} from 'src/components';
import DropdownInput from 'src/components/form/DropdownInput.vue';
import { useDialog, useLoading } from 'src/composable';
import { PropType, ref } from 'vue';
import { LoanDto } from '~api/loan/loan.dto';
import { Loan } from '~libs/entities';
import { CompanyType } from '~libs/entities/enums';

const props = defineProps({
  loan: {
    type: Object as PropType<Loan>,
    default: undefined,
  },
});

const { dialogRef, emitData } = useDialog();
const { loading, toast } = useLoading();

const state = ref<LoanDto>(
  props.loan || {
    id: null,
    name: '',
    start_at: new Date(),
    end_at: new Date(),
    mininum_loan_amount: 0,
    maximum_loan_amount: 0,
    min_operation_year: 0,
    valid_company_type: CompanyType.PRIVATE_LIMITED,
    min_annual_sales: 0,
    is_malaysia_company: true,
    instalment_tenure_year: 0,
    interest_rate: 0,
  }
);

function updateDateRange(v: Date[]) {
  state.value.start_at = dayjs(v[0]).startOf('day').toDate();
  state.value.end_at = dayjs(v[1]).endOf('day').toDate();
}

function submit() {
  toast(
    async () => {
      if (props.loan) {
        await Api.Loan.updateLoan(state.value);
        emitData();
      } else {
        await Api.Loan.createLoan(state.value);
        emitData();
      }
    },
    {
      isLoading: loading,
      message: props.loan ? 'Updating loan...' : 'Creating loan...',
      successMessage: props.loan
        ? 'Updated loan successfully'
        : 'Created loan successfully',
    }
  );
}
</script>

<template>
  <GlobalDialog
    ref="dialogRef"
    :title="loan ? 'Update Loan' : 'Create Loan'"
    padding="md"
    position="right"
    @submit="submit"
  >
    <div class="q-gutter-y-md">
      <TextInput v-model="state.name" title="Name" required />

      <AppForm title="Date" required>
        <DateRangePicker
          :model-value="[state.start_at, state.end_at]"
          title="Date"
          class="full-width"
          :time-picker="false"
          @update:model-value="updateDateRange"
        />
      </AppForm>

      <AppForm title="Loan Amount" required>
        <div class="row items-center justify-evenly no-wrap">
          <TextInput
            type="number"
            v-model="state.mininum_loan_amount"
            prefix="MYR"
            :number="{
              decimal: 2,
              min: 1,
            }"
            class="full-width"
          />
          <div class="q-px-sm">~</div>
          <TextInput
            type="number"
            v-model="state.maximum_loan_amount"
            :number="{
              decimal: 2,
              min: 1,
            }"
            prefix="MYR"
            class="full-width"
          />
        </div>
      </AppForm>

      <TextInput
        type="number"
        v-model="state.min_operation_year"
        title="Min Operation Year"
        required
        :number="{
          min: 1,
        }"
      />

      <DropdownInput
        v-model="state.valid_company_type"
        :options="
          Object.keys(CompanyType).map((v) => ({
            label: capitalCase(v),
            value: v,
          }))
        "
        title="Valid Company Type"
        required
      />

      <TextInput
        v-model="state.min_annual_sales"
        title="Min Annual Sales"
        required
        :number="{
          decimal: 2,
          min: 1,
        }"
      />

      <AppForm title="Is Malaysia Company" required>
        <q-toggle
          v-model="state.is_malaysia_company"
          title="Is Malaysia Company"
        />
      </AppForm>

      <TextInput
        v-model="state.instalment_tenure_year"
        title="Instalment Tenure Year"
        required
        :number="{
          min: 1,
        }"
      />
    </div>
    {{ state }}

    <template #actions>
      <PrimaryButton label="Submit" type="submit" />
    </template>
  </GlobalDialog>
</template>
