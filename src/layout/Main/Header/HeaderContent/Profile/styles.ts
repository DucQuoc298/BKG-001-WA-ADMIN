export default {
  icon: {
    fontSize: "18px",
  },
  label: {
    ml: 2,
    color: "text.primary",
  },
  paper: {
    width: 290,
    minWidth: 240,
    maxWidth: { xs: 250, md: 290 },
    borderRadius: 4,
  },
  profile_button: { 
    display: 'flex', 
    alignItems: 'center', 
    textTransform: 'none', 
    backgroundColor: 'background.paper', 
    borderRadius: 6,
    ":after": {
      borderRadius: 6,
    },
    ":active::after": {
      borderRadius: 6,
    },
    color: 'text.primary', 
    '&:hover': { backgroundColor: 'background.paper' },
    padding: '7px 12px',
  },
  menu_item:{
    display: 'flex', 
    alignItems: 'center', 
    p: 1,
    px: 2, 
    cursor: 'pointer', 
    '&:hover': {backgroundColor: 'action.hover'}
  },
  modal:{
    logo: {
      width: 40,
      height: 40,
      alignSelf: 'center',
    },
    name: {
      fontFamily: 'Noto Sans, sans-serif',
    },
    row: {
      p: 2,
      borderBottom: '1px solid grey',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    text_row: {
      textTransform: 'uppercase',
      fontWeight: '600',
      fontSize: 12,
    },
    value_row: {
      fontWeight: 'bold',
    }
  }
}
