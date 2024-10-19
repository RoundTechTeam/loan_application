import {
  RouteLocationNormalizedLoaded,
  createRouter,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createWebHistory(),
});

async function validateRoute(
  to: RouteLocationNormalizedLoaded
): Promise<true | string> {
  for (const matched of to.matched) {
    const guards = matched.meta.guards || [];
    for (const guard of guards) {
      const res = guard(to);
      if (res !== true) return res;
    }
  }
  return true;
}

Router.beforeEach(async (to, from, next) => {
  const res = await validateRoute(to);
  if (res !== true) {
    if (to.name === res) next();
    else next({ name: res });
    return;
  }

  next();
});

export default Router;
