export default {
  toolbar: {
    backgroundColor: 'background.paper',
  },
  gridContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  buttonMenu: {
    button: {
      borderRadius: '8px',
      borderEndEndRadius: 0,
      borderStartEndRadius: 0,
      paddingRight: "8px",
      // marginRight: '1px',
      
    },
    iconButton: {
      color: 'white',
      borderRadius: '8px',
      bgcolor: 'primary.main',
      minHeight: "38px",
      "& .MuiButton-startIcon": {
        mr: "0px !important",
      },
      "&:hover": {
        bgcolor: 'primary.dark',
        color: 'white'
      },
    }
  }
};