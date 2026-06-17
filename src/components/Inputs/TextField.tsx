import { FormControl, FormHelperText, TextField as MuiTextField, TextFieldProps } from "@mui/material";
import inputStyles from "./styles";
import React from "react";
import Label from "./Label";
interface ITextFieldProps {
  value?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: string
}

const TextField: React.FC<ITextFieldProps & TextFieldProps> = ({ label, value, onChange, errors, required, multiline, ...props }) => {
  const iStyles = inputStyles();
  return (
    <FormControl fullWidth >
      <Label required={required} label={label} />
      <MuiTextField
        label={undefined}
        sx={{
          ...iStyles.textfield,
          ...(multiline &&
          {
            '& .MuiInputBase-input': {
              // overflowY: 'auto !important',
              minHeight: '40px !important',
              padding: "0px",
              // height: 'auto !important',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              height: 'auto !important',
            }
          })
        }}
        value={value}
        placeholder={label}
        onChange={onChange}
        multiline={multiline}
        {...props}
      />
      {errors && (
        <FormHelperText error id="helper-text-company-signup">
          {errors}
        </FormHelperText>
      )}
    </FormControl>
  )
};

export default TextField;
