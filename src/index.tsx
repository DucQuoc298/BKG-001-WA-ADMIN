import React from 'react';
import ReactDOM from 'react-dom/client';
// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// apex-chart
import 'assets/third-party/react-table.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

// project imports
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider, MainProvider } from 'hooks';
import { authConfig, mainConfig, KEY_CONTEXT } from 'themes/config';
import ThemeCustomization from 'themes';
import { CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { Provider } from 'react-redux';
import { store } from 'store/createStore';
import { Snackbar } from 'components';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
// import { LicenseInfo } from "@mui/x-license-pro";

const siteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY || '';

// const licenseKey = import.meta.env.VITE_MUI_TABLE_LICENSE;
// LicenseInfo.setLicenseKey(licenseKey as string);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// ==============================|| MAIN - REACT DOM RENDER ||============================== //

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
        <AuthProvider
          storageKey={KEY_CONTEXT.AUTH}
          initialState={authConfig}
        >
          <MainProvider
            storageKey={KEY_CONTEXT.MAIN}
            initialState={mainConfig}
          >
            <ThemeCustomization>
              <I18nextProvider i18n={i18n}>
                <CssBaseline />
                <App />
                <Snackbar />
              </I18nextProvider>
            </ThemeCustomization>
          </MainProvider>
        </AuthProvider>
      </GoogleReCaptchaProvider>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
