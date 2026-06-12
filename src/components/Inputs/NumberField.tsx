import { SxProps } from "@mui/material";
import React, { forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import inputStyles from "./styles";
import TextField from "./TextField";

type INumberFieldProps = Omit<NumericFormatProps, "onChange"> & ReturnType<UseFormRegister<any>> & {
  label?: string;
  handleChange?: (e: any) => void;
  sx?: SxProps;
  inputRef?: any;
  error?: boolean;
  helperText?: string;
  isAbs?: boolean;
  endAdornment?: React.ReactNode;
};

const NumberField = forwardRef<HTMLInputElement, INumberFieldProps>(function NumberField({
  label,
  name,
  thousandSeparator = ",",
  decimalSeparator = ".",
  decimalScale = 2,
  required = false,
  disabled = false,
  value,
  sx,
  onChange,
  onBlur,
  autoFocus,
  inputRef,
  isAbs = true,
  error,
  onFocus,
  helperText,
  handleChange,
  endAdornment,
  ...props
}, ref) {
  const iStyles = inputStyles();

  return (
    <NumericFormat
      customInput={TextField}
      {...props}
      sx={{
        ...iStyles.textfield,
        ...sx, 
      }}
      label={label}
      placeholder={label}
      value={value}
      getInputRef={inputRef || ref}
      error={error}
      helperText={helperText}
      disabled={disabled}
      required={required}
      variant="outlined"
      allowNegative={!isAbs}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      decimalScale={decimalScale}
      onBlur={onBlur}
      onFocus={onFocus}
      onValueChange={(v) => {
        const { floatValue } = v
        const event = {
          target: {
            name,
            value: floatValue,
          }
        };
        onChange?.(event as any);
        handleChange?.(event);
      }}
      slotProps={{
        input: {
          autoFocus,
          endAdornment,
        }
      }}
    />
  )
})

export default NumberField;