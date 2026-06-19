import { lazy } from 'react';
import React from 'react';
// project imports
import Loadable from 'components/Loadable';
import AuthLayout from 'layout/Auth';
import { MaintenanceNameRoutes } from 'types';

const Error404 = Loadable(lazy(() => import('pages/maintenance/Error404')));
const Error500 = Loadable(lazy(() => import('pages/maintenance/Error500')));
const Error401 = Loadable(lazy(() => import('pages/maintenance/Error401')));
const Error403 = Loadable(lazy(() => import('pages/maintenance/Error403')));
const Error503 = Loadable(lazy(() => import('pages/maintenance/Error503')));
// ==============================|| MAINTENANCE ROUTING ||============================== //


const MaintenanceRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      path: MaintenanceNameRoutes.ERROR_404,
      index: true,
      element: <Error404 />
    },
    {
      path: MaintenanceNameRoutes.ERROR_500,
      element: <Error500 />
    },
    {
      path: MaintenanceNameRoutes.ERROR_401,
      element: <Error401 />
    },
    {
      path: MaintenanceNameRoutes.ERROR_403,
      element: <Error403 />
    },
    {
      path: MaintenanceNameRoutes.ERROR_503,
      element: <Error503 />
    },
    {
      path: '*',
      element: <Error404 />
    }
  ]
};

export default MaintenanceRoutes;
