import React, { useEffect } from 'react';
import { Outlet} from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
// project imports
import Drawer from './Drawer';
import Header from './Header';
import Loader from 'components/Loader';
// import Breadcrumbs from 'components/@extended/Breadcrumbs';
import ScrollTop from 'components/ScrollTop';

import { handlerDrawerOpen, useGetMenuMaster } from 'hooks/useMenu';
import { DRAWER_WIDTH, HEADER_HEIGHT, TOOLBAR_HEIGHT } from 'themes/config';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  // set media wise responsive drawer
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <ScrollTop />
      <Header />
      <Drawer />

      <Box component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            position: 'relative',
            minHeight: `calc(100vh - ${HEADER_HEIGHT + TOOLBAR_HEIGHT}px)`,
            display: 'flex',
            flexDirection: 'column',
            pt: `${TOOLBAR_HEIGHT + HEADER_HEIGHT}px`
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
