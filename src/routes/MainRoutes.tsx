import { lazy } from 'react';
import React from 'react';
import { Navigate } from 'react-router-dom';
// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Main';
import { MainNameRoutes } from 'types';

// render- Main
const Home = Loadable(lazy(() => import('pages/main/Home')));
const PluginRuntime = Loadable(lazy(() => import('runtime/LoadFormRuntime')));
const Invoice = Loadable(lazy(() => import('pages/main/Invoice')));
const Bill = Loadable(lazy(() => import('pages/main/Bill')));
const Components = Loadable(lazy(() => import('pages/main/Components')));


const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <Navigate to={MainNameRoutes.HOME} replace />
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
      path: MainNameRoutes.BILL,
      children: [
        {
          index: true,
          element: <Bill />
        }
      ]
    },
    {
      path: MainNameRoutes.COMPONENTS,
      children: [
        {
          index: true,
          element: <Components />
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
