import { createBrowserRouter } from 'react-router-dom';

// project imports
import MainRoutes, { MainNameRoutes } from './MainRoutes';
import AuthRoutes, { AuthNameRoutes } from './AuthRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([MainRoutes, AuthRoutes], { basename: '/' });

export default router;
export { AuthNameRoutes, MainNameRoutes };
