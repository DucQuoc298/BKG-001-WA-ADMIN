
import { Theme as MuiTheme, ThemeOptions as MuiThemeOptions, Palette as MuiPalette, PaletteOptions as MuiPaletteOptions } from '@mui/material/styles';

export interface CustomShadows {
  button: string;
  text: string;
  z1: string;
  primary: string;
  secondary: string;
  error: string;
  warning: string;
  info: string;
  success: string;
  grey: string;
  primaryButton: string;
  secondaryButton: string;
  errorButton: string;
  warningButton: string;
  infoButton: string;
  successButton: string;
  greyButton: string;
}
declare module '@mui/material/styles' {
  interface Theme extends MuiTheme {
        customShadows: CustomShadows;
  }

  interface ThemeOptions extends MuiThemeOptions {
        customShadows?: CustomShadows;
  }
}

declare module '@mui/material/styles/createPalette' {
    interface Palette extends MuiPalette {
        text: {
            primary: string;
            secondary: string;
            disabled: string;
        },
        customShadows: CustomShadows;
    }
    interface PaletteOptions extends MuiPaletteOptions {
        text?: {
            primary?: string;
            secondary?: string;
            disabled?: string;
        },
        customShadows?: CustomShadows;
    }
}
