import { createBrowserRouter } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import MaintenanceRoutes from './Maintenance';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, AuthRoutes, MaintenanceRoutes], { basename: import.meta.env.VITE_BASE_URL });

export default router;
