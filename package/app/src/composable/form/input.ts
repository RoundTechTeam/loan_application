import { ref } from 'vue';

export default () => {
  const inputRef = ref<{ validate: () => Promise<void> }>();

  async function validate() {
    await inputRef.value?.validate();
  }

  return { inputRef, validateInput: validate };
};
