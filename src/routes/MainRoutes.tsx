import { lazy } from 'react';
import React from 'react';
// project imports
import Loadable from 'components/Loadable';
// import DashboardLayout from 'layout/Main';

// render- Main
const Dashboard = Loadable(lazy(() => import('pages/main/default')));

export const MainNameRoutes = {
  HOME: '/home',
}
const MainRoutes = {
  path: '/',
  // element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />
    },
    {
      path: MainNameRoutes.HOME,
      children: [
        {
          index: true,
          element: <Dashboard />
        }
      ]
    },

  ]
};

export default MainRoutes;
