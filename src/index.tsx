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
import { AuthProvider, MainProvider, AppRuntimeProvider } from 'hooks';
import { authConfig, mainConfig, KEY_CONTEXT } from 'themes/config';
import ThemeCustomization from 'themes';
import { CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// ==============================|| MAIN - REACT DOM RENDER ||============================== //

root.render(
  <React.StrictMode>

    <AuthProvider
        storageKey={KEY_CONTEXT.AUTH}
        initialState={authConfig}
      >
        <MainProvider
          storageKey={KEY_CONTEXT.MAIN}
          initialState={mainConfig}
        >
        <AppRuntimeProvider>
            <ThemeCustomization>
              <I18nextProvider i18n={i18n}>
                <CssBaseline />
                <App />
              </I18nextProvider>
          </ThemeCustomization>
        </AppRuntimeProvider>
        </MainProvider>
      </AuthProvider>
    </React.StrictMode>
);
reportWebVitals();
