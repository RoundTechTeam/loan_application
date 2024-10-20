<script setup lang="ts">
import { capitalCase } from 'change-case';
import dayjs from 'dayjs';
import { Api } from 'src/api';
import scanDocument from 'src/assets/animation/scanDocu,ent.json';
import {
  AppForm,
  DropdownInput,
  GlobalDialog,
  PrimaryButton,
  TextInput,
} from 'src/components';
import { useDialog, useFile, useLoading } from 'src/composable';
import { notify, prompt } from 'src/plugins';
import { PropType, ref } from 'vue';
import { Vue3Lottie } from 'vue3-lottie';
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
const { loading, toast, loaded } = useLoading();
const company_document_file = useFile({
  extensions: ['jpg', 'jpeg', 'png', 'pdf'],
  maxBytes: 1000000,
});

const state = ref<LoanApplicationDto>({
  is_malaysia_company: true,
  annual_sales: 0,
  company_type: CompanyType.PRIVATE_LIMITED,
  loan_id: props.loan.id,
  operation_year: 0,
  business_name: '',
  file_image_path: '',
});

const test = ref('');

async function aiScanDocument() {
  if (!company_document_file.file.value) return;

  if (company_document_file.file.value) {
    const [url] = await Api.Store.upload([company_document_file.file.value]);

    state.value.file_image_path = url;
  }

  toast(
    async () => {
      loaded.value = true;
      const result = await Api.Loan.aiScanDocument(state.value.file_image_path);

      if (result) {
        state.value.business_name = result['Company Name'];
        state.value.company_type = result['Company Type'];

        const date = new Date(result['Company Incorporation Date']);
        state.value.operation_year = dayjs().year() - date.getFullYear();

        state.value.annual_sales = result['Retain Earning'];
      }
      loaded.value = false;
    },
    {
      isLoading: loading,
      successMessage: 'Document scanned successfully',
    }
  );
}

async function submit() {
  if (!company_document_file.file.value)
    return notify.error('No file selected');

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
    position="right"
    @submit="submit"
  >
    <Vue3Lottie v-if="loaded" id="Vue3Lottie" :animationData="scanDocument" />
    <div v-else class="q-gutter-y-md">
      <AppForm title="Loan Name">
        <div>{{ loan.name }}</div>
      </AppForm>
      <AppForm title="Upload Document" required>
        <q-file
          outlined
          use-chips
          :accept="company_document_file.accept.value"
          :hint="company_document_file.hint.value"
          :max-file-size="company_document_file.maxFileSize"
          :error="!!company_document_file.error.value"
          dense
          :error-message="company_document_file.error.value || undefined"
          @rejected="company_document_file.handleError"
          v-model="company_document_file.file.value"
          @update:model-value="() => aiScanDocument()"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" @click.stop.prevent />
          </template>
        </q-file>
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
      <PrimaryButton v-if="!loaded" label="Submit" type="submit" />
    </template>
  </GlobalDialog>
</template>
