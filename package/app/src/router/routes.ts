import { useUserStore } from 'src/stores/user';
import { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    guards?: ((to: RouteLocationNormalized) => true | string)[];
  }
}

export enum AppRoute {
  //Login
  Login = 'Login',
  Register = 'Register',
  Verified = 'Verified',
  Logout = 'Logout',

  //General
  Dashboard = 'Dashboard',
  Loan = 'Loan',

  //Profile Settings
  Profile = 'Profile',
}

function authGuard(): true | string {
  const user = useUserStore();
  console.log('AuthorizedGuard - user.isLoggedIn', user.isLoggedIn);
  console.log(
    'AuthorizedGuard - user.currentUser.is_verified',
    user.isVerified
  );
  if (!user.isLoggedIn) return AppRoute.Login;
  console.log('Guard: Logged In but not Verified');
  if (!user.isVerified) return AppRoute.Verified;
  return true;
}

function authorizedGuard(): true | string {
  const user = useUserStore();
  console.log('AuthorizedGuard - user.isLoggedIn', user.isLoggedIn);
  console.log(
    'AuthorizedGuard - user.currentUser.is_verified',
    user.isVerified
  );

  if (user.isLoggedIn) {
    if (!user.isVerified) {
      return AppRoute.Verified;
    }
    return AppRoute.Dashboard;
  } else if (!user.isLoggedIn) {
    return AppRoute.Login;
  }

  // return { route: true };

  return true;
}

const routes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: {
      name: AppRoute.Login,
    },
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: AppRoute.Login,
        meta: {
          guards: [authorizedGuard],
        },
        component: () => import('pages/auth/Login.vue'),
      },
      // {
      //   path: 'forget-password',
      //   name: AppRoute.ForgetPassword,
      //   meta: {
      //     guards: [authorizedGuard],
      //   },
      //   component: () => import('pages/auth/ForgetPassword.vue'),
      // },
      // {
      //   path: 'reset-password',
      //   name: AppRoute.ResetPassword,
      //   component: () => import('pages/auth/ResetPassword.vue'),
      // },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      guards: [authGuard],
    },
    children: [
      {
        path: '/dashboard',
        name: AppRoute.Dashboard,
        component: () => import('pages/dashboard/Index.vue'),
      },
      {
        path: '/loan',
        name: AppRoute.Loan,
        component: () => import('pages/loan/Index.vue'),
      },
      {
        path: '/profile',
        name: AppRoute.Profile,
        component: () => import('pages/profile/Index.vue'),
      },
    ],
  },
  {
    path: '/register',
    name: AppRoute.Register,
    meta: {
      guards: [],
    },
    component: () => import('pages/auth/Register.vue'),
  },
  {
    path: '/verfied',
    name: AppRoute.Verified,
    meta: {
      guards: [authorizedGuard],
    },
    component: () => import('pages/auth/Verfied.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
