// material-ui
import Box from '@mui/material/Box';

// project imports
import Profile from './Profile';
import Notification from './Notification';
import React from 'react';
// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  // const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      <Box sx={{height: 50, display: 'flex', width: '100%', bgcolor: 'red'}} >
        
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 2 }}>
        <Notification />
        <Profile />
      </Box>
    </>
  );
}
