// ==============================|| OVERRIDES - TABLE ROW ||============================== //

export default function TableBody(theme) {
  const hoverStyle = {
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  };

  return {
    MuiTableBody: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.paper,
          '& .MuiTableRow-root': {
            ...hoverStyle
          }
        }
      }
    }
  };
}
