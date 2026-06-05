import { lazy } from 'react';
import React from 'react';
// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Main';
import { MainNameRoutes } from 'types';

// render- Main
const Dashboard = Loadable(lazy(() => import('pages/main/default')));
const Home = Loadable(lazy(() => import('pages/main/Home')));
const PluginRuntime = Loadable(lazy(() => import('runtime/LoadFormRuntime')));
const Invoice = Loadable(lazy(() => import('pages/main/Invoice')));

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
    {
      path: MainNameRoutes.INVOICE,
      children: [
        {
          index: true,
          element: <Invoice />
        }
      ]
    },
    {
      path: MainNameRoutes.USER_FORMS,
      element: <PluginRuntime />
    }
  ]
};

export default MainRoutes;
