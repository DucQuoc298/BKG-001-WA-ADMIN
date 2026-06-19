// import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material-ui

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { useTranslation } from 'react-i18next';
import { Button, TextField } from 'components';
import { useAuth } from 'hooks/useConfig';
import { MainNameRoutes } from 'types';


// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin() {
  const { state, setState } = useAuth();
  const [rememberMe, setRememberMe] = React.useState(state.rememberMe !== null ? true : false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <>
      <Formik
        onSubmit={async (values) => {
          // login({ username: values.username, password: values.password, captcha }, (data) => {
          // const { token, refreshToken, ...safeData } = data
          setState((prevState) => ({ ...prevState, user: JSON.stringify(values), loginStatus: true, token: '', refreshToken: '', rememberMe: rememberMe ? values.username : null }));
          // setAuthToken(token, refreshToken);
          const queryParams = new URLSearchParams(window.location.search);

          const redirectUrl = queryParams.get('redirect');
          if (redirectUrl) {
            window.location.href = decodeURIComponent(redirectUrl);
          } else {
            navigate(MainNameRoutes.HOME);
          }
        }}
        initialValues={{
          username: state.rememberMe !== null ? state.rememberMe : '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required(t('errors.required', { 0: t('AUTH.username') })),
          password: Yup.string()
            .required(t('errors.required', { 0: t('AUTH.password') }))
            .test('no-leading-trailing-whitespace', t('errors.no_leading_trailing_whitespace', { 0: t('AUTH.password') }), (value) => value === value.trim())
            .max(10, t('errors.max_length', { 0: t('AUTH.password'), max: 10 }))
        })}
      >
        {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  id="username-login"
                  type="text"
                  required
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
                    {errors.username as string}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  required
                  error={Boolean(touched.password && errors.password)}
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>)
                    }
                  }}
                  label={t("AUTH.password")}
                />
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        name="rememberMe"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">{t("AUTH.rememberme")}</Typography>}
                  />
                  <Link variant="h6" component={RouterLink} to="/forgot-password" color="text.primary">
                    {t("AUTH.forgot_password")}
                  </Link>
                </Stack>
              </Grid>
              <Grid size={12}>
                {/* <AnimateButton> */}
                <Button
                  fullWidth size="large"
                  variant="contained"
                  color="primary"
                  type='submit'
                  // disabled={authLoading}
                  text={t("AUTH.login_button")}
                >
                </Button>
                {/* </AnimateButton> */}
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = {};
