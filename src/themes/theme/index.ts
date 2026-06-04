// ==============================|| PRESET THEME - DEFAULT ||============================== //

import { colors } from "@mui/material";
import { buildGrey } from "themes/palette";
import { IThemeMode } from "types";
import tinycolor from "tinycolor2";
import CustomShadows from "themes/custom-shadows";
interface IColorDefault {
  primary: string; //#1976D2
  secondary: string; // '#21303f';
  warning: string; // '#FFC260';
  success: string; // '#3CD4A0';
  info: string; // '#9013FE';
  error: string; // '#750606';
  grey: string; // '#4D4D4D';
}

const convertColorLighten = (
  color?: tinycolor.ColorInput,
  amount?: number
): string => {
  return tinycolor(color).lighten(amount).toHexString();
};
const convertColorDarken = (
  color?: tinycolor.ColorInput,
  amount?: number
): string => {
  return tinycolor(color).darken(amount).toHexString();
};
export const defaultColorTheme: IColorDefault = {
  primary: "#1976D2",
  secondary: "#21303f",
  warning: "#FFC260",
  success: "#3CD4A0",
  info: "#9013FE",
  error: "#750606",
  grey: "#4D4D4D",
};

export const defaultLvColorTheme = {
  lightenRate: 7.5,
  darkenRate: 15,
};
export default {
  palette: {
    primary: {
      main: defaultColorTheme.primary,
      light: convertColorLighten(
        defaultColorTheme.primary,
        defaultLvColorTheme.lightenRate
      ),
      dark: convertColorDarken(
        defaultColorTheme.primary,
        defaultLvColorTheme.darkenRate
      ),
    },
    text: {
      primary: "#21303f",
      secondary: "#566879",
      third: "#566879",
      hint: "#B9B9B9",
    },
  },
};
export function Default(colors) {
  const { grey } = colors;
  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };

  return {
    grey: {
      lighter: greyColors[100],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500],
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: greyColors[0]
    }
  };
}

const lightColors = { grey: buildGrey(IThemeMode.LIGHT) };
const darkColors = { grey: buildGrey(IThemeMode.DARK) };
const lightPaletteColor = Default(lightColors);
const darkPaletteColor = Default(darkColors);
const paletteLightColor = {
    mode: 'light',
    background: {
      default: "transparent",  
      defaultChannel: "255 255 255",
      paper: "#f0fafe",       
    },
    zone: {
      header: "#f0fafe",      
      sidebar: "#f0fafe",    
      content: "rgba(255,255,255,0.75)",
      footer: "#f0f4f8",
    } as any,
    primary: {
      main: "#1076BB",
      light: "#70AFEB",
      lighter: "#DFF2FA",
      dark: "#05397D",
      light1: "#E9ECEF"
    },

    text: {
      primary: "#000000",
      secondary: "#8c8c8c"
    },
}
const paletteDarkColor = {
    mode: 'dark',
    background: {
      default: "#121212", 
      paper: "#272e41"
    },
    primary: {
      main: "#46a0f4ff",
      light: "#213365",
      lighter: "#283e7a",
      dark: "#70AFEB",
      light1: "#2b2b2c"
    },
    zone: {
      header: "#272e41",
      sidebar: "#272e41",
      content: "rgba(255,255,255,0.75)",
      footer: "#f0f4f8",
    } as any,
    text: {
      primary: "#ffffffff",
      secondary: "#ffffffff"
    },
}

export const themes = {
  [IThemeMode.LIGHT]: {
    palette: {
      ...paletteLightColor,
      ...lightPaletteColor,
      customShadows: CustomShadows(paletteLightColor),
    },
    colors: {
      ...colors,
    },
  },
  [IThemeMode.DARK]: {
    palette: {
      ...paletteDarkColor,
      ...darkPaletteColor,
      customShadows: CustomShadows(paletteDarkColor),
      
    },
    colors: {
      ...colors,
    },
  },
};

export const overrides = (themeMode: IThemeMode) => ({
  typography: {
    fontFamily: `'Public Sans', sans-serif`,
  },
  breakpoints: {
    keys: [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ],
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: themeMode === IThemeMode.LIGHT
            ? 'linear-gradient(135deg, #80b8f0 0%, #dff2fa 50%, #ffffff 100%)'
            : 'linear-gradient(135deg, #121212 0%, #1a2a3a 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: themeMode === IThemeMode.LIGHT ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)",
        },
      },
    },
  },
});