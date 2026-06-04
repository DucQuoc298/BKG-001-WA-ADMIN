import { lazy } from 'react';
import React from 'react';
// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Main';

// render- Main
const Dashboard = Loadable(lazy(() => import('pages/main/default')));
const Home = Loadable(lazy(() => import('pages/main/Home')));

export const MainNameRoutes = {
  HOME: '/home',
}
const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/dashboard',
      index: true,
      element: <Dashboard />
    },
    {
      path: MainNameRoutes.HOME,
      children: [
        {
          index: true,
          element: <Home />
        }
      ]
    },

  ]
};

export default MainRoutes;
