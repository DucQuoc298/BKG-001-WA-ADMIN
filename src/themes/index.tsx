import PropTypes from 'prop-types';
import { useMemo } from 'react';
import React from 'react';

// material-ui
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// project imports
import componentsOverride from './overrides';
import Typography from './typography';
import { overrides, themes } from './theme';
import { useMain } from 'hooks/useConfig';

// ==============================|| DEFAULT THEME - MAIN ||============================== //

export default function ThemeCustomization({ children }) {
  const { state } = useMain();

  const themeTypography = useMemo(() => Typography(state.fontFamily), [state.fontFamily]);

  const palette = useMemo(() => themes[state.themeMode], [state.themeMode]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440
        }
      },
      direction: 'ltr',
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      typography: themeTypography,
      palette: palette.palette,
      customShadows: palette.palette.customShadows,
      text: palette.text,
      cssVariables: {
        cssVarPrefix: '',
        colorSchemeSelector: 'data-color-scheme'
      }
    }),
    [themeTypography, palette]
  );

  const theme= createTheme(themeOptions as any, overrides(state.themeMode) as any);
  const gradientLight = [
    '#bce7ff 0%',    // A
    '#bee8febb 40%',   // B
    '#bee8fede 40%',   // C
    '#bee8fecb 70%',   // D
    '#bee8fe 70%',   // E
    '#bee8fe 100%',
  ].join(', ');

  const gradientDark = [
    '#0d0d0d 0%',    // A
    '#1a1a2e 40%',   // B
    '#16213e 40%',   // C
    '#0f3460 70%',   // D
    '#1a2a4a 70%',   // E
    '#1a2a3a 100%',  // F
  ].join(', ');

  theme.components = {
    ...componentsOverride(theme),
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: state.themeMode === 'dark'
            ? `linear-gradient(135deg, ${gradientDark})`
            : `linear-gradient(135deg, ${gradientLight})`,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
  };

  return (
      <ThemeProvider disableTransitionOnChange theme={theme} modeStorageKey="theme-mode" defaultMode='light'>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
  );
}

ThemeCustomization.propTypes = { children: PropTypes.node };
