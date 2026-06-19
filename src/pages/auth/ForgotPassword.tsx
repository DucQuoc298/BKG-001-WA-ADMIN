import { useNavigate } from 'react-router-dom';
import React, { useCallback, useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Logo from 'assets/images/logo192.png';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import AuthForgotPassword from 'sections/auth/AuthForgotPassword';
import AuthConfirmForgotPassword from 'sections/auth/AuthConfirmForgotPassword';
import AuthResetPassword from 'sections/auth/AuthResetPassword';
import { AuthNameRoutes } from 'routes/AuthRoutes';
import { useUser } from 'hooks';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { CAPTCHA_ACTION } from 'types';


// ================================|| JWT - FORGOT PASSWORD ||================================ //
enum FormType {
  forgotPassword = 'forgot_password',
  confirmForgotPassword = 'confirm_forgot_password',
  resetPassword = 'reset_password'
}
export default function ForgotPassword() {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormType>(FormType.forgotPassword);
  const navigate = useNavigate();
  const {authConfirmCode, forgotPassword, confirmForgotPassword, resetPassword} = useUser();
  const [verificationCode, setVerificationCode] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const handleForgotPassword = async ({userid, email}) => {
    let captcha = '';
    if (executeRecaptcha) {
      try {
        captcha = await executeRecaptcha(CAPTCHA_ACTION.FORGOT_PASSWORD);
      } catch (err) {
        console.error('executeRecaptcha error:', err);
      }
    }
    forgotPassword({userid, email, captcha}, () => {
      setForm(FormType.confirmForgotPassword);
    });
  }

  const handleConfirmForgotPassword = useCallback(({verificationCode}) => {
    authConfirmCode && confirmForgotPassword({confirmCode: authConfirmCode, verificationCode}, () => {
      setVerificationCode(verificationCode);
      setForm(FormType.resetPassword);
    });
  }, [authConfirmCode, confirmForgotPassword]);


  const handleResetPassword = useCallback(async ({ newPassword}) => {
    let captcha = '';
    if (executeRecaptcha) {
      try {
        captcha = await executeRecaptcha(CAPTCHA_ACTION.RESET_PASSWORD);
      } catch (err) {
        console.error('executeRecaptcha error:', err);
      }
    }
    authConfirmCode && resetPassword({confirmCode: authConfirmCode, verifyCode: verificationCode, newPassword, captcha}, () => {
      navigate(AuthNameRoutes.LOGIN);
      setForm(FormType.forgotPassword);
      setVerificationCode('');
    });
  }, [authConfirmCode, resetPassword, navigate, verificationCode, executeRecaptcha]);

  return (
    <AuthWrapper>
      <Grid container sx={{ maxWidth: 400 }}>
        <Grid container spacing={3} size={12}>
          <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img src={Logo} alt="Logo" style={{ width: '70px', height: 'auto', }} />
              </Box>
              <Typography variant="h3" textAlign={'center'}>{t(`page.${form.toUpperCase()}`)}</Typography>
              {form === FormType.confirmForgotPassword && (
                <Typography variant="body2" textAlign={'center'} sx={{ mt: 1.5 }}>
                  {t("AUTH.forgot_password_desc")}
                </Typography>
              )}
          </Grid>
          <Grid size={12}>
            {form === FormType.forgotPassword && <AuthForgotPassword handleForgotPassword={handleForgotPassword} />}
            {form === FormType.confirmForgotPassword && <AuthConfirmForgotPassword handleConfirmForgotPassword={handleConfirmForgotPassword} />}
            {form === FormType.resetPassword && <AuthResetPassword handleResetPassword={handleResetPassword} />}
          </Grid>
        </Grid>
        </Grid>
    </AuthWrapper>
  );
}
