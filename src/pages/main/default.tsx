import { Grid, Typography } from '@mui/material';
import React, { useState } from 'react';


// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Hi, Welcome back
      </Typography>
    </Grid>
  );
}
