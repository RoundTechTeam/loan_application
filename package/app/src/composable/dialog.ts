import { GlobalDialogType } from 'src/components/type';
import { isRef, ref, unref } from 'vue';

export default () => {
  const dialogRef = ref<GlobalDialogType>();

  function emitData(data?: unknown) {
    dialogRef.value?.onDialogOK(isRef(data) ? unref(data) : data);
  }

  function cancel() {
    dialogRef.value?.onDialogCancel();
  }

  async function validate() {
    return await dialogRef.value?.validate();
  }

  function reset() {
    dialogRef.value?.reset();
  }

  return { dialogRef, emitData, cancel, validate, reset };
};
