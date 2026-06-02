import { lazy } from 'react';
import React from 'react';
// project imports
import Loadable from 'components/Loadable';
import AuthLayout from 'layout/Auth';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));
const ForgotPasswordPage = Loadable(lazy(() => import('pages/auth/ForgotPassword')));
// ==============================|| AUTH ROUTING ||============================== //

export const AuthNameRoutes = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
}
const AuthRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      path: '/',
      element: <LoginPage />
    },
    {
      path: AuthNameRoutes.LOGIN,
      default: true,
      element: <LoginPage />
    },
    {
      path: AuthNameRoutes.REGISTER,
      element: <RegisterPage />
    },
    {
      path: AuthNameRoutes.FORGOT_PASSWORD,
      element: <ForgotPasswordPage />
    }
  ]
};

export default AuthRoutes;
