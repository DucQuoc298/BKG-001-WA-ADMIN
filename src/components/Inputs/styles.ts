import { maxWidth } from "@mui/system";

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
        padding: "6px 10px",
        height: '24px !important',
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: '8px',
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
    }
  };
};
