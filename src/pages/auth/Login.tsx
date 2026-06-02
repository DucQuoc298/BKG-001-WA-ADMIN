import { Link } from 'react-router-dom';
import React from 'react';
// material-ui
import Grid from '@mui/material/Grid';
// import MicrosoftLogo from 'assets/images/icons/microsoft.svg';
import Logo from 'assets/images/logo192.png';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
// import { Button } from 'components';

// ================================|| JWT - LOGIN ||================================ //

export default function Login() {
  const { t } = useTranslation()
  return (
    <AuthWrapper>
      <Grid container sx={{ maxWidth: 400  }}>
        
        <Grid container spacing={3} size={12}>
          <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img src={Logo} alt="Logo" style={{ width: '70px', height: 'auto', }} />
              </Box>
              <Typography variant="h3" textAlign={'center'}>{t('page.LOGIN')}</Typography>
          </Grid>
          <Grid size={12}>
            <AuthLogin />
            <Typography textAlign={'center'} mt={1}> {t('AUTH.signup_prompt')}
              <Typography component={Link} to={'/register'} variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                { t('AUTH.signup_link')}
              </Typography>
            </Typography>
          </Grid>
          {/* <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Button 
              text={t('AUTH.ms_login_button')}
              startIcon={<img src={MicrosoftLogo} alt="ms-logo" style={{ width: '20px', height: '20px', marginRight: '8px' }} />} 
              fullWidth 
              variant="outlined" 
              onClick={() => {
                window.open(`${import.meta.env.VITE_MS_LOGIN_AUTHORITY}`, '_blank');
              }}
            />
          </Grid> */}
        </Grid>
        </Grid>
    </AuthWrapper>
  );
}
