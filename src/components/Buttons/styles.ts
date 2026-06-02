export default () => {
  return {
    buttonIcon: {
      borderRadius: '8px',
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "24px",
      textTransform: "none",
      // pr: "0px",
      "& .MuiButton-startIcon": {
        mr: "3px !important",
      },
      "&.Mui-disabled": {
        color: "grey !important", 
      },
      "& .MuiButton-startIcon>*:nth-of-type(1)": {
        fontSize: "16px",
      },
      "&:hover": {
        color: "white",
      },
    },
    button: {
      // textTransform: "none",
      // height: "36px",
      // maxHeight: "36px",
      // minHeight: "36px",
      // borderRadius: '8px',
      // "&:hover": {
      //   color: "white",
      // },
    },
  };
};
