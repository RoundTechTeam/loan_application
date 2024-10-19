import { useQuasar } from 'quasar';
import { computed } from 'vue';

export function useResponsive() {
  const { screen } = useQuasar();

  const isMobile = computed(() => screen.xs);

  function getValue<T>(v: { mobile: T; desktop: T }): T {
    return isMobile.value ? v.mobile : v.desktop;
  }

  return {
    screen,
    isMobile,
    getValue,
    gte: computed(() => {
      return {
        xs: screen.xs || screen.sm || screen.md || screen.lg || screen.xl,
        sm: screen.md || screen.lg || screen.xl,
        md: screen.lg || screen.xl,
        lg: screen.xl,
      };
    }),
    lte: computed(() => {
      return {
        xs: screen.xs,
        sm: screen.xs || screen.sm,
        md: screen.xs || screen.sm || screen.md,
        lg: screen.xs || screen.sm || screen.md || screen.lg,
      };
    }),
  };
}

export function useDevice() {
  const { platform } = useQuasar();
  const isIPhone = computed(() => platform.is.ios && platform.is.iphone);

  return {
    isIPhone,
  };
}
