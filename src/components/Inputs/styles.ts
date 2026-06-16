
export default () => {
  return {
    autocomplete: {
      "& .MuiAutocomplete-input": {
        padding: '10px 10px !important'
      },
      "& .MuiOutlinedInput-root": {
        padding: '0px !important'
      }
    },
    textfield: {
      // width: "100%",
      borderRadius: "8px",
      "& .MuiFormLabel-asterisk": {
        color: "red",
      },
      "& .MuiInputBase-input": {
        padding: "0px 10px !important",
        height: '38px !important',
        boxSizing: 'border-box',
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: '8px',
        height: '38px !important',
        boxSizing: 'border-box',
        padding: '0px !important',
      },
      "& .MuiSelect-select": {
        padding: "0px 10px !important",
        height: '38px !important',
        lineHeight: '38px',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
      },
    },
    labelDefault: {
      "& .MuiFormLabel-asterisk": {
        color: "red",
      },
      display: "flex",
      fontSize: "14px",
      height: "24px",
      fontWeight: 500,
      // mb: "4px",
    },
    searchfield: {
      width: "100%",
      minWidth: "200px",
      maxWidth: "300px",
      "& .MuiInputBase-root": {
        height: '34px !important',
        px: "6px !important",
        borderRadius: "8px",
      },
      "& input": {
        "&::placeholder": { fontSize: "12px" },
        fontSize: "14px",
        lineHeight: "22px",
        p: "8px",
      },
    },
    clearButton: {
      padding: "0px !important",
      marginRight: "4px",
      borderRadius: "8px",
      "& .clear-range-btn": {
        opacity: 0,
        pointerEvents: "none",
        transition: "opacity 0.15s ease",
      },
      "&:hover .clear-range-btn, & .Mui-focused .clear-range-btn": {
        opacity: 1,
        pointerEvents: "auto",
      },
    }
  };
};
