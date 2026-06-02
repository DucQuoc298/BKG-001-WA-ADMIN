// project imports
import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - TAB ||============================== //

export default function Tab(theme) {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 46,
          color: theme.palette.text.primary,
          borderRadius: 4,
          '&:hover': {
            backgroundColor: withAlpha(theme.palette.primary.light, 0.6),
            color: theme.palette.primary.main
          },
          '&:focus-visible': {
            borderRadius: 4,
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: -3
          }
        }
      }
    }
  };
}
