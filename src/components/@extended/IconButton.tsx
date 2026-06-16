import PropTypes from 'prop-types';

// material-ui
import MuiIconButton from '@mui/material/IconButton';
import type { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import React from 'react';
// project imports
import getColors from 'utils/getColors';
import getShadow from 'utils/getShadow';
import { withAlpha } from 'utils/colorUtils';
import { IThemeMode } from 'types/commom';

function getColorStyle({ variant, theme, color }) {
  const themeMode = theme.palette.mode;
  const colors = getColors(theme, color);
  const { lighter, light, dark, main, contrastText } = colors;

  const buttonShadow = `${color}Button`;
  const shadows = getShadow(theme, buttonShadow);

  const commonShadow = {
    '&::after': {
      boxShadow: `0 0 6px 6px ${withAlpha(main, 0.9)}`
    },
    '&:active::after': {
      boxShadow: `0 0 0 0 ${withAlpha(main, 0.9)}`
    },
    '&:focus-visible': {
      outline: `2px solid ${dark}`,
      outlineOffset: 2
    }
  };

  switch (variant) {
    case 'contained':
      return {
        color: contrastText,
        background: main,
        '&:hover': {
          background: dark
        },
        ...commonShadow
      };
    case 'light':
      return {
        color: main,
        background: lighter,
        '&:hover': {
          background: withAlpha(light, 0.5)
        },
        ...commonShadow
      };
    case 'shadow':
      return {
        boxShadow: shadows,
        color: contrastText,
        background: main,
        '&:hover': {
          boxShadow: 'none',
          background: dark
        },
        ...commonShadow
      };
    case 'outlined':
      return {
        '&:hover': {
          background: 'transparent',
          color: dark,
          borderColor: dark
        },
        ...commonShadow
      };
    case 'dashed':
      return {
        background: lighter,
        '&:hover': {
          color: dark,
          borderColor: dark
        },
        ...commonShadow
      };
    case 'text':
    default:
      return {
        '&:hover': {
          color: dark,
          background: color === 'secondary' ? withAlpha(light, 0.1) : themeMode === IThemeMode.LIGHT ? withAlpha(main, 0.1) : withAlpha(dark, 0.)
        },
        ...commonShadow
      };
  }
}

const IconButtonStyle = styled(MuiIconButton, { shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'shape' })<{ variant?: Variant; shape?: Shape }>(
  ({ theme, color, variant }) => ({
    position: 'relative',
    '::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      borderRadius: 4,
      opacity: 0,
      transition: 'all 0.5s'
    },

    ':active::after': {
      position: 'absolute',
      borderRadius: 4,
      left: 0,
      top: 0,
      opacity: 1,
      transition: '0s'
    },

    ...getColorStyle({ variant, theme, color }),

    variants: [
      {
        props: { shape: 'rounded' },
        style: {
          borderRadius: '50%',
          '::after': { borderRadius: '50%' },
          ':active::after': { borderRadius: '50%' }
        }
      },
      {
        props: { variant: 'outlined' },
        style: {
          border: '1px solid',
          borderColor: 'inherit'
        }
      },
      {
        props: { variant: 'dashed' },
        style: {
          border: '1px dashed',
          borderColor: 'inherit'
        }
      },
      {
        props: ({ variant }) => variant !== 'text',
        style: {
          '&.Mui-disabled': {
            background: theme.palette.grey[200],
            '&:hover': {
              background: theme.palette.grey[200],
              color: theme.palette.grey[300],
              borderColor: 'inherit'
            }
          }
        }
      }
    ]
  })
);

type Variant = 'text' | 'contained' | 'outlined' | 'light' | 'shadow' | 'dashed';
type Shape = 'square' | 'rounded';

interface IconButtonProps extends Omit<MuiIconButtonProps, 'color'> {
  variant?: Variant;
  shape?: Shape;
  color?: MuiIconButtonProps['color'];
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'text', shape = 'square', color = 'primary', ...others },
  ref
) {
  return <IconButtonStyle ref={ref} disableRipple variant={variant} shape={shape} color={color} {...others} />;
});

IconButton.displayName = 'IconButton';

export default IconButton;

getColorStyle.propTypes = { variant: PropTypes.any, theme: PropTypes.any, color: PropTypes.any };

IconButton.propTypes = {
  variant: PropTypes.string,
  shape: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  others: PropTypes.any
};
