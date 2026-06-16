import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
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
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { forgotPassword, confirmForgotPassword, resetPassword } from 'services';
import { AuthNameRoutes } from 'types';

// ================================|| JWT - FORGOT PASSWORD ||================================ //
enum FormType {
  forgotPassword = 'forgot_password',
  confirmForgotPassword = 'confirm_forgot_password',
  resetPassword = 'reset_password'
}
export default function ForgotPassword() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormType>(FormType.forgotPassword);
  const [authData, setAuthData] = useState<{ userid?: string; email?: string; confirmCode?: string; verifyCode?: string }>({});
  const { executeRecaptcha } = useGoogleReCaptcha();
  const navigate = useNavigate();

  const handleForgotPassword = async (values: { userid: string; email: string }) => {
    let captchaToken = '';
    if (executeRecaptcha) {
      try {
        captchaToken = await executeRecaptcha('forgot_password');
      } catch (error) {
        console.error('reCAPTCHA execution failed:', error);
      }
    }

    try {
      await forgotPassword({ userid: values.userid, email: values.email, captcha: captchaToken }, (res) => {
        const confirmCode = res?.confirmCode || res?.data?.confirmCode || '';
        setAuthData({ userid: values.userid, email: values.email, confirmCode });
        setForm(FormType.confirmForgotPassword);
      });
    } catch (error) {
      console.error('Forgot password request failed:', error);
    }
  };

  const handleConfirmForgotPassword  = async (values: { confirmCode: string; verificationCode: string }) => {
    try {
      const confirmCode = authData.confirmCode || values.confirmCode;
      await confirmForgotPassword({ confirmCode, verificationCode: values.verificationCode }, (res) => {
        setAuthData(prev => ({ ...prev, verifyCode: values.verificationCode, confirmCode }));
        setForm(FormType.resetPassword);
      });
    } catch (error) {
      console.error('Confirm forgot password failed:', error);
    }
  };

  const handleResetPassword = async (values: { newPassword: string }) => {
    let captchaToken = '';
    if (executeRecaptcha) {
      try {
        captchaToken = await executeRecaptcha('reset_password');
      } catch (error) {
        console.error('reCAPTCHA execution failed:', error);
      }
    }

    try {
      await resetPassword({
        confirmCode: authData.confirmCode || '',
        newPassword: values.newPassword,
        verifyCode: authData.verifyCode || '',
        captcha: captchaToken
      }, (res) => {
        console.log("Password reset successful:", res);
        setForm(FormType.forgotPassword);
        navigate(AuthNameRoutes.LOGIN);
      });
    } catch (error) {
      console.error('Reset password failed:', error);
    }
  };
  return (
    <AuthWrapper>
      <Grid container sx={{ maxWidth: 400 }}>
        <Grid container spacing={3} size={12}>
          <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img src={Logo} alt="Logo" style={{ width: '70px', height: 'auto', }} />
              </Box>
              <Typography variant="h3" sx={{textAlign: 'center'}}>{t(`page.${form.toUpperCase()}`)}</Typography>
              {form === FormType.confirmForgotPassword && (
                <Typography variant="body2" sx={{ mt: 1.5, textAlign: 'center' }}>
                  {t("AUTH.forgot_password_desc")}
                </Typography>
              )}
          </Grid>
          <Grid size={12}>
            {form === FormType.forgotPassword && <AuthForgotPassword handleForgotPassword={handleForgotPassword} />}
            {form === FormType.confirmForgotPassword && <AuthConfirmForgotPassword handleConfirmForgotPassword={handleConfirmForgotPassword} />}
            {form === FormType.resetPassword && <AuthResetPassword handleResetPassword={handleResetPassword}/>}
          </Grid>
        </Grid>
        </Grid>
    </AuthWrapper>
  );
}
