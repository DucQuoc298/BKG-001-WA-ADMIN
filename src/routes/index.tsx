import { createBrowserRouter } from 'react-router-dom';

// project imports
import AuthRoutes from './AuthRoutes';
import MainRoutes from './Mainroutes';
import MaintenanceRoutes from './Maintenance';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([AuthRoutes, MainRoutes, MaintenanceRoutes], { basename: import.meta.env.VITE_BASE_URL });

export default router;
