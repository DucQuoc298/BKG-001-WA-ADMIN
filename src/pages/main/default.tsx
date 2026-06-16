import { Grid, Typography } from '@mui/material';
import React from 'react';

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
