// import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// material-ui
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

import { useTranslation } from 'react-i18next';
import { Button, TextField } from 'components';
import { AuthNameRoutes } from 'routes/AuthRoutes';

// ============================|| JWT - FORGOT PASSWORD ||============================ //
interface IAuthForgotPasswordProps {
  handleForgotPassword: (values: { userid: string; email: string }, callback: (data: any) => void) => void;
}
export default function AuthForgotPassword({ handleForgotPassword }: IAuthForgotPasswordProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Formik
        onSubmit={(values) => {
          handleForgotPassword({ userid: values.username, email: values.email }, () => {
            navigate('/auth/confirm-forgot-password', { state: { username: values.username, email: values.email } });
          })
        }}
        initialValues={{
          username: '',
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required(t('errors.required', { 0: t('AUTH.username') })),
          email: Yup.string().email(t('errors.invalid_email')).max(255).required(t('errors.required', { 0: t('AUTH.email') }))
        })}
      >
        {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  id="username-login"
                  type="email"
                  value={values.username}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label={t("AUTH.username")}
                  fullWidth
                  error={Boolean(touched.username && errors.username)}
                />
                {touched.username && errors.username && (
                  <FormHelperText error id="standard-weight-helper-text-username-login">
                    {errors.username}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <TextField
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label={t("AUTH.email")}
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
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
                  text={t("AUTH.continue")}
                />
              </Grid>
              <Grid size={12}>
                <Button
                  fullWidth
                  size="large"
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(AuthNameRoutes.LOGIN)}
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

AuthForgotPassword.propTypes = {};
