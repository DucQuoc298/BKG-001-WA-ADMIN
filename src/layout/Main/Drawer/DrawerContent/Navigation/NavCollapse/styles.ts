import { useTheme } from "@mui/material/styles";
export default () => {
  const theme = useTheme();
  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';
  return {
    listButton: ({drawerOpen, level}: {drawerOpen: boolean | undefined, level: number})=>({
      zIndex: 1201,
      pl: drawerOpen ? `${level * 28}px` : 1.5,
      py: !drawerOpen && level === 1 ? 1.25 : 1,
      ...(drawerOpen && {
        '&:hover': { bgcolor: 'primary.lighter' },
        '&.Mui-selected': {
          bgcolor: 'primary.lighter',
          borderRight: '2px solid',
          borderColor: 'primary.main',
          color: iconSelectedColor,
          '&:hover': { color: iconSelectedColor, bgcolor: 'primary.lighter' }
        }
      }),
      ...(!drawerOpen && {
        '&:hover': { bgcolor: 'transparent' },
        '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
      })
    }),
    listIcon: ({drawerOpen, isSelected}: {drawerOpen: boolean | undefined, isSelected: boolean})=>({
      minWidth: 28,
      color: isSelected ? iconSelectedColor : textColor,
      ...(!drawerOpen && {
        borderRadius: 1.5,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': { bgcolor: 'secondary.lighter' }
      }),
      ...(!drawerOpen &&
        isSelected && {
          bgcolor: 'primary.lighter',
          '&:hover': { bgcolor: 'primary.lighter' }
        })
    }),
    iconOpenCollapse: (isSelected: boolean)=> ({
      color: isSelected ? iconSelectedColor : textColor,
      fontSize: '1.25rem',
    }),
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
