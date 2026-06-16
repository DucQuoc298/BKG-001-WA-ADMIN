// material-ui
import Box from '@mui/material/Box';
import React from 'react';
// project import
import NavGroup from './NavGroup';
import menuItem from '../../../../../menu-items'


// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  return <Box sx={{ pt: 2 }}>
    <NavGroup item={menuItem.children} />
  </Box>;
}
