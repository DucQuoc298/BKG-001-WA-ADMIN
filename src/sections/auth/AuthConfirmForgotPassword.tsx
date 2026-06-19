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

// ============================|| JWT - LOGIN ||============================ //
interface IAuthConfirmForgotPasswordProps {
  handleConfirmForgotPassword: (values: { confirmCode: string; verificationCode: string }) => void;
}
export default function AuthConfirmForgotPassword({ handleConfirmForgotPassword }: IAuthConfirmForgotPasswordProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Formik
        onSubmit={(values) => {
          handleConfirmForgotPassword({ confirmCode: values.confirmCode, verificationCode: values.verifyCode });
        }}
        initialValues={{
          verifyCode: '',
          confirmCode: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          verifyCode: Yup.string().max(255).required(t("errors.required", { 0: t("AUTH.code_verify") })),
        })}
      >
        {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  id="verify-code"
                  type="text"
                  value={values.verifyCode}
                  name="verifyCode"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label={t("AUTH.code_verify")}
                  fullWidth
                  error={Boolean(touched.verifyCode && errors.verifyCode)}
                />
                {touched.verifyCode && errors.verifyCode && (
                  <FormHelperText error id="standard-weight-helper-text-verify-code-login">
                    {errors.verifyCode}
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

AuthConfirmForgotPassword.propTypes = {};
