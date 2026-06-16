// ==============================|| OVERRIDES - DRAWER ||============================== //

export default function Drawer(theme?: any) {
  return {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: theme?.palette?.zone?.sidebar ?? '#05397D',
          color: '#ffffff',
        }
      }
    }
  };
}
