import { useTheme } from "@mui/material/styles";
import { alpha } from '@mui/material/styles';
export default () => {
  const theme = useTheme();
  
  return {
    popper: {
      overflow: 'visible',
      zIndex: 2001,
      minWidth: 180,
      '&:before': {
        content: '""',
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 120,
        borderLeft: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }
    },
    popperPaper: {
      maxHeight: '800px',
      padding: '8px',
      overflowY: 'auto',
      boxShadow: theme.shadows[8],
      backgroundImage: 'none'
    },
  };
};
