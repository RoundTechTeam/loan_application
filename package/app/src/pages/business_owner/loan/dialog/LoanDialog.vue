<script setup lang="ts">
import { capitalCase } from 'change-case';
import dayjs from 'dayjs';
import {
  AppForm,
  DateRangePicker,
  GlobalDialog,
  TextInput,
} from 'src/components';
import DropdownInput from 'src/components/form/DropdownInput.vue';
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

const state = ref<LoanDto>(
  props.loan || {
    id: null,
    name: '',
    start_at: dayjs().startOf('day').toDate(),
    end_at: dayjs().endOf('day').toDate(),
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
</script>

<template>
  <GlobalDialog ref="dialogRef" title="Loan Info" padding="md" position="right">
    <div class="q-gutter-y-md">
      <TextInput v-model="state.name" title="Name" disable />

      <AppForm title="Date">
        <DateRangePicker
          :model-value="[state.start_at, state.end_at]"
          title="Date"
          class="full-width"
          :time-picker="false"
          @update:model-value="updateDateRange"
          disable
        />
      </AppForm>

      <AppForm title="Loan Amount">
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
            disable
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
            disable
          />
        </div>
      </AppForm>

      <TextInput
        type="number"
        v-model="state.min_operation_year"
        title="Min Operation Year"
        :number="{
          min: 1,
        }"
        disable
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
        disable
      />

      <TextInput
        v-model="state.min_annual_sales"
        title="Min Annual Sales"
        :number="{
          decimal: 2,
          min: 1,
        }"
        disable
      />

      <AppForm title="Is Malaysia Company">
        <div>{{ state.is_malaysia_company ? 'Yes' : 'No' }}</div>
      </AppForm>

      <TextInput
        v-model="state.instalment_tenure_year"
        title="Instalment Tenure Year"
        :number="{
          min: 1,
        }"
        disable
      />
    </div>
  </GlobalDialog>
</template>
