import React from 'react';
// material-ui
import Grid from '@mui/material/Grid';
// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import FirebaseRegister from 'sections/auth/AuthRegister';
// import { useMediaQuery } from '@mui/material';

// ================================|| JWT - REGISTER ||================================ //

export default function Register() {
  // const downMD = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  return (
    <AuthWrapper>
      <Grid container sx={{ maxWidth: 400 }}>
        <Grid container spacing={3} size={12 }>
          <Grid size={12}>
            <FirebaseRegister  />
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
