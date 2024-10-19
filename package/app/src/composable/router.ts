import { AppRoute } from 'src/router/routes';
import { useRoute, useRouter } from 'vue-router';

export function useRouting() {
  const router = useRouter();
  const route = useRoute();

  function isRouteActive(appRoute: AppRoute | undefined, exact = false) {
    if (route.name === appRoute && exact) {
      return true;
    } else if (appRoute) {
      const itemRoutePath = router.resolve({
        name: appRoute,
      }).href;

      const match = route.matched.some((m) => m.path.includes(itemRoutePath));
      return match;
    }
    return false;
  }

  return {
    isActive(appRoute: AppRoute, exact = false) {
      return isRouteActive(appRoute, exact);
    },
    resolve(appRoute: AppRoute) {
      const route = router.resolve({
        name: appRoute,
      });
      return new URL(route.href, window.location.origin).href;
    },
  };
}
