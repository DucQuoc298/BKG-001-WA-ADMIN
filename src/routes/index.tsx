import { createBrowserRouter } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
import MaintenanceRoutes from './Maintenance';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, MaintenanceRoutes], { basename: import.meta.env.VITE_BASE_URL });

export default router;
