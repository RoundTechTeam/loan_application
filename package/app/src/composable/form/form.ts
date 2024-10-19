import { QForm } from 'quasar';
import { InputModel } from 'src/components/type';
import { ref } from 'vue';

export default () => {
  const formRef = ref<QForm>();

  async function resetValidation() {
    formRef.value?.resetValidation();
  }

  async function validate() {
    const resp = await formRef.value?.validate();
    return resp || false;
  }

  function getValue<T>(value: InputModel, type: 'string' | 'number'): T {
    let result = value;
    switch (type) {
      case 'string':
        result = (value || '').toString();
        break;
      case 'number':
        // eslint-disable-next-line no-case-declarations
        const v = Number.parseFloat((value || '').toString());
        result = Number.isNaN(v) ? 0 : v;
        break;
    }
    return result as unknown as T;
  }

  return { formRef, validate, getValue, resetValidation };
};
