
export default () => {
  return {
    list: (sideBarOpen: boolean) => ({
      mb: sideBarOpen ? 1.5 : 0,
      py: 0,
      zIndex: 0,
      pr: sideBarOpen ? 1 : 0,
      pl: sideBarOpen ? 1 : 0
    }),
    subheaderBox: {
      pl: 3,
      mb: 1.5
    },
    subheaderTypography: {
      variant: 'subtitle2',
      color: 'textSecondary'
    }
  };
};
