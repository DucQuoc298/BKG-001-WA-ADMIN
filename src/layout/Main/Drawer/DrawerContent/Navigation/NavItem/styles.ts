
export default () => {
  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';
  return {
    listItemButton: ({ drawerOpen, level }: { drawerOpen: boolean | undefined, level: number }) => ({
      zIndex: 1201,
      pl: drawerOpen ? `${level * 28}px` : 1.5,
      py: !drawerOpen && level === 1 ? 1.25 : 1,
      ...(drawerOpen && {
        '&:hover': { bgcolor: 'grey.200' },
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
    listItemIcon: ({ drawerOpen, isSelected }: { drawerOpen: boolean | undefined, isSelected: boolean }) => ({
      minWidth: 28,
      color: isSelected ? iconSelectedColor : textColor,
      ...(!drawerOpen && {
        borderRadius: 1.5,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': { bgcolor: 'grey.200' }
      }),
      ...(!drawerOpen &&
        isSelected && {
          bgcolor: 'primary.lighter',
          '&:hover': { bgcolor: 'primary.lighter' }
        })
    })
  }
};