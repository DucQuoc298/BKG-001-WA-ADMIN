import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
// project imports
import Drawer from './Drawer';
import Header from './Header';
import Loader from 'components/Loader';
// import Breadcrumbs from 'components/@extended/Breadcrumbs';
import ScrollTop from 'components/ScrollTop';

import { handlerDrawerOpen, useGetMenuMaster } from 'hooks/useMenu';
import { DRAWER_WIDTH, HEADER_HEIGHT, TOOLBAR_HEIGHT } from 'themes/config';
import { useAuth, useBroadcastChannel, useLocalStorage, useUser } from 'hooks';
import { BroadcastEventTypes, redirectToLogin } from 'services';
import { CAPTCHA_ACTION } from 'types';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { setAuthToken } from 'utils';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const navigate = useNavigate();
  const { resetState: resetAuthState, state, setState } = useAuth();
  const { state: authToken } = useLocalStorage('authToken', state.token as string);
  const { getConfig } = useUser();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [hasFetchedConfig, setHasFetchedConfig] = useState(false);

  useBroadcastChannel((message) => {
    if (message.type === BroadcastEventTypes.AUTH_LOGOUT) {
      resetAuthState();
      redirectToLogin(false);
    }
  });

  useEffect(() => {
    if (hasFetchedConfig) return;

    const siteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY;
    const isGoogleSiteKey = typeof siteKey === 'string' && siteKey.startsWith('6') && siteKey.length >= 30;

    if (isGoogleSiteKey && !executeRecaptcha) {
      return;
    }
    const fetchConfig = async () => {
      setHasFetchedConfig(true);
      let captcha = '';
      if (executeRecaptcha) {
        try {
          captcha = await executeRecaptcha(CAPTCHA_ACTION.GET_CONFIG);
        } catch (err) {
          console.error('executeRecaptcha error:', err);
        }
      }
      getConfig({ accessToken: authToken, captcha }, (res) => {
        if (!res || !res.login) {
          redirectToLogin(true)
        }
        if (res && !!res.lastmodule) {
          navigate(`/${res.lastmodule.toLowerCase()}`);
        }
        setState((prevState) => ({ ...prevState, user: JSON.stringify(res), loginStatus: res.login, token: authToken, refreshToken: res.refreshToken }));
        setAuthToken(authToken, res.refreshToken);
      });
    };

    fetchConfig();
  }, [executeRecaptcha, authToken, hasFetchedConfig]);

  // set media wise responsive drawer
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <ScrollTop />
      <Header />
      <Drawer />

      <Box component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            position: 'relative',
            minHeight: `calc(100vh - ${HEADER_HEIGHT + TOOLBAR_HEIGHT}px)`,
            display: 'flex',
            flexDirection: 'column',
            pt: `${TOOLBAR_HEIGHT + HEADER_HEIGHT}px`
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
