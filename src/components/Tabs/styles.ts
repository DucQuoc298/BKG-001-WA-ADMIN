
export default {
  tabs: {
    minHeight: "44px",
    "& button:first-of-type": {
      alignItems: "flex-start !important",
      minWidth: "fit-content",
    },
    position: 'relative',
    overflow: 'visible',
    '& .MuiTabs-scrollButtons': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      // marginTop: "12px",
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      zIndex: 2,
      pointerEvents: 'auto',
      backgroundColor: 'grey.100'
    },
    '& .MuiTabs-scrollButtons:first-of-type': {
      left: 0,
    },
    '& .MuiTabs-scrollButtons:last-of-type': {
      right: 0,
    },
    '& .MuiTabs-scrollButtons .MuiIconButton-root': {
      pointerEvents: 'auto',
      background: 'transparent',
      boxShadow: 'none',
    },
    '& .MuiTabs-scrollButtons.Mui-disabled': {
      opacity: 0,
    },
  },
  tab: {
    textTransform: "none",
    fontWeight: 500,
    minHeight: "40px",
    maxHeight: "40px",
    py: "0px",
    color: 'text.primary',
    "&:hover": {
      backgroundColor: 'transparent'
    }
  },
  label: {
    textTransform: "none",
    fontWeight: 700,
    fontSize: "14px",
    display: 'flex',
  },
  count: {
    fontSize: "12px",
    ml: 0.5,
    borderRadius: "8px",
    bgcolor: "grey.200",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: '2px 6px',
  }
}