import { clone } from 'src/helpers';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default <T = any>(defaultValue?: T) => {
  const route = useRoute();
  const router = useRouter();
  const query = ref<T>(clone<any>(defaultValue || route.query || {}));

  watch(
    () => query.value,
    (v) => {
      const query: any = { ...route.query };
      if (v) {
        Object.entries(v).forEach(([key, value]) => {
          query[key] = value;
        });
      }
      router.replace({ query });
    },
    {
      deep: true,
      immediate: true,
    }
  );

  return {
    query,
    getValue: (key: string) => {
      return route.query[key];
    },
  };
};
