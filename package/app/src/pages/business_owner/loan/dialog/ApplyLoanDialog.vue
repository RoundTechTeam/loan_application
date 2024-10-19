<script setup lang="ts">
import { GlobalDialog, PrimaryButton } from 'src/components';
import { useDialog, useLoading } from 'src/composable';
import { useUserStore } from 'src/stores/user';
import { PropType, ref } from 'vue';
import { LoanApplicationDto } from '~api/loan/loan.dto';

const props = defineProps({
  loanApplicationDto: {
    type: Object as PropType<LoanApplicationDto>,
    required: true,
  },
});
const { dialogRef, emitData } = useDialog();
const { loading, toast } = useLoading();
const user = useUserStore();

const state = ref<LoanApplicationDto>({
  id: props.loanApplicationDto.id ?? null,
  user_id: user.currentUser?.id ?? 0,
  loan_id: props.loanApplicationDto.loan_id ?? 0,
});

function submit() {
  toast(
    async () => {
      if (props.loanApplicationDto?.id) {
        // await Api.Loan.updateLoanApplication(state.value);
        emitData();
      } else {
        // await Api.Loan.createLoanApplication(state.value);
        emitData();
      }
    },
    {
      isLoading: loading,
      message: props.loanApplicationDto.id
        ? 'Updating loan application...'
        : 'Applying loan application...',
      successMessage: props.loanApplicationDto.id
        ? 'Updated loan application successfully'
        : 'Applied loan application successfully',
    }
  );
}
</script>

<template>
  <GlobalDialog
    ref="dialogRef"
    :title="
      props.loanApplicationDto.id
        ? 'Update Loan Application'
        : 'Apply Loan Application'
    "
    padding="md"
    position="right"
    @submit="submit"
  >
    <div class="q-gutter-y-md">Show Company Information</div>

    <template #actions>
      <PrimaryButton label="Submit" type="submit" />
    </template>
  </GlobalDialog>
</template>
