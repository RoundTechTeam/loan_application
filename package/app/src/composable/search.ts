import { computed, ref } from 'vue';

export default (initialValue?: string) => {
  const searchKey = ref(initialValue || '');

  function format(text: unknown) {
    return `${text}`.trim().toLowerCase();
  }

  const formattedSearchKey = computed(() => format(searchKey.value));

  function filter(arr: unknown[]): boolean {
    if (!formattedSearchKey.value) return true;
    return arr.some((el) => format(el).includes(formattedSearchKey.value));
  }

  return { searchKey, filter };
};
