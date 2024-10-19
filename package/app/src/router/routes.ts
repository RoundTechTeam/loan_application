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

  //Admin
  AdminDashboard = 'AdminDashboard',
  AdminProfile = 'Profile',
  AdminLoan = 'AdminLoan',
  AdminLoanApplication = 'AdminLoanApplication',

  //Business Owner
  UserDashboard = 'UserDashboard',
  UserLoan = 'UserLoan',
  UserLoanApplication = 'UserLoanApplication',
  UserProfile = 'UserProfile',
}

function authGuard(): true | string {
  const user = useUserStore();
  if (!user.isLoggedIn) return AppRoute.Login;
  if (!user.isVerified) return AppRoute.Verified;

  return true;
}

function adminGuard(): true | string {
  const user = useUserStore();
  if (!user.isLoggedIn) return AppRoute.Login;
  if (!user.isAdmin) return AppRoute.UserDashboard;

  return true;
}

function authorizedGuard(): true | string {
  const user = useUserStore();

  if (user.isLoggedIn) {
    if (user.isAdmin) return AppRoute.AdminDashboard;
    if (!user.isVerified) {
      return AppRoute.Verified;
    }
    return AppRoute.UserDashboard;
  } else if (!user.isLoggedIn) {
    return AppRoute.Login;
  }

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
    path: '/admin',
    component: () => import('src/layouts/AdminLayout.vue'),
    meta: {
      guards: [adminGuard],
    },
    children: [
      {
        path: 'dashboard',
        name: AppRoute.AdminDashboard,
        component: () => import('pages/admin/dashboard/Index.vue'),
      },
      {
        path: 'loan',
        name: AppRoute.AdminLoan,
        component: () => import('pages/admin/loan/Index.vue'),
      },
      {
        path: 'profile',
        name: AppRoute.AdminProfile,
        component: () => import('pages/profile/Index.vue'),
      },
      {
        path: 'loan-application',
        name: AppRoute.AdminLoanApplication,
        component: () => import('pages/loan_application/Index.vue'),
      },
    ],
  },
  {
    path: '',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: {
      guards: [authGuard],
    },
    children: [
      {
        path: 'dashboard',
        name: AppRoute.UserDashboard,
        component: () => import('pages/business_owner/dashboard/Index.vue'),
      },
      {
        path: 'profile',
        name: AppRoute.UserProfile,
        component: () => import('pages/profile/Index.vue'),
      },
      {
        path: 'loan',
        name: AppRoute.UserLoan,
        component: () => import('pages/business_owner/loan/Index.vue'),
      },
      {
        path: 'loan-application',
        name: AppRoute.UserLoanApplication,
        component: () => import('pages/loan_application/Index.vue'),
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
    path: '/verified',
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
