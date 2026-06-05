// import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

import { useTranslation } from 'react-i18next';
import { Button, TextField } from 'components';
import { InputAdornment } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { AuthNameRoutes } from 'types';

// ============================|| JWT - RESET PASSWORD ||============================ //
interface IAuthResetPasswordProps {
  handleResetPassword: (values: { newPassword: string }) => void;
}
export default function AuthResetPassword({ handleResetPassword }: IAuthResetPasswordProps) {
  const { t } = useTranslation();
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });
  const navigate = useNavigate();
  return (
    <>
      <Formik
        onSubmit={(values)=>{
          handleResetPassword({newPassword: values.newPassword});
        }}
        initialValues={{
          verifyCode: '',
          newPassword: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          newPassword: Yup.string().required(t('errors.required', { 0: t('AUTH.new_password') })).test('no-leading-trailing-whitespace', t('errors.no_leading_trailing_whitespace', { 0: t('AUTH.new_password') }), (value) => value === value?.trim())
              .max(20, t('errors.max_length', { 0: t('AUTH.new_password'), 1: 20 })),
          confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], t("errors.confirm_password_must_match_new_password")).required(t("errors.required", {0: t("AUTH.confirm_password")}))
        })}
      >
        {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField 
                  id="new-password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={values.newPassword}
                  name="newPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label={t("AUTH.new_password")}
                  fullWidth
                  required
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  slotProps={{
                    input: {
                      endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={()=> setShowPasswords({...showPasswords, new: !showPasswords.new})}
                          onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        color="secondary"
                      >
                        {showPasswords.new ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment> )
                    }
                  }}
                />
                {touched.newPassword && errors.newPassword && (
                  <FormHelperText error id="standard-weight-helper-text-new-password-login">
                    {errors.newPassword}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <TextField 
                  id="confirm-password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  required
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label={t("AUTH.confirm_password")}
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={()=> setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                          onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        color="secondary"
                      >
                        {showPasswords.confirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment> )
                    }
                  }}
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormHelperText error id="standard-weight-helper-text-confirm-password-login">
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Button 
                fullWidth 
                size="large"
                variant="contained" 
                color="primary" 
                type='submit' 
                // disabled={authLoading}
                text={t("AUTH.continue")} 
                />
              </Grid>
              <Grid size={12}>
                <Button 
                fullWidth 
                size="large"
                variant="outlined" 
                color="primary" 
                onClick={()=>navigate(AuthNameRoutes.LOGIN)}
                // disabled={authLoading}
                text={t("AUTH.back_to_login")} 
                />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthResetPassword.propTypes = {  };
