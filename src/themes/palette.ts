// third-party
import { presetPalettes } from '@ant-design/colors';

// project imports
import {Default} from './theme';
import { extendPaletteWithChannels } from 'utils/colorUtils';

type ThemeMode = 'light' | 'dark';

// ==============================|| GREY COLORS BUILDER ||============================== //

export function buildGrey(themeMode: ThemeMode = 'light') {
  const greyPrimary = themeMode === 'light' ? [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ] : [
    '#000000',
    '#141414',
    '#1e1e1e',
    '#595959',
    '#8c8c8c',
    '#bfbfbf',
    '#d9d9d9',
    '#f0f0f0',
    '#f5f5f5',
    '#fafafa',
    '#ffffff'
  ];
  const greyConstant = ['#fafafb', '#e6ebf1'];

  return [...greyPrimary, ...greyConstant];
}

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export function buildPalette() {
  const lightColors = { ...presetPalettes, grey: buildGrey('light') };
  const lightPaletteColor = Default(lightColors);

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPaletteColor);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight,
      text: {
        primary: extendedLight.grey[700],
        secondary: extendedLight.grey[500],
        disabled: extendedLight.grey[400]
      },
      action: { disabled: extendedLight.grey[300] },
      divider: extendedLight.grey[200],
      background: {
        paper: extendedLight.grey[0],
        default: extendedLight.grey.A50
      }
    }
  };
}
