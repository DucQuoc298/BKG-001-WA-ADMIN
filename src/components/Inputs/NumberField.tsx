import { SxProps } from "@mui/material";
import React, { forwardRef, useState, useEffect } from "react";
import { UseFormRegister, UseFormTrigger } from "react-hook-form";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import inputStyles from "./styles";
import TextField from "./TextField";

type INumberFieldProps = Omit<NumericFormatProps, "onChange"> & ReturnType<UseFormRegister<any>> & {
  label?: string;
  fullWidth?: boolean;
  handleChange?: (e: any) => void;
  sx?: SxProps;
  inputRef?: any;
  trigger?: UseFormTrigger<any>;
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
  // fullWidth = true,
  defaultValue,
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
  ...props
}, ref) {
  const iStyles = inputStyles();

  return (
    <NumericFormat
      customInput={TextField}
      {...props}
      sx={{
        ...sx, 
        ...iStyles.textfield,
      }}
      label={label}
      placeholder={label}
      // defaultValue={defaultValue}
      value={value ?? 0}
      getInputRef={inputRef || ref}
      error={error}
      helperText={helperText}
      variant="outlined"
      allowNegative={!isAbs}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      decimalScale={decimalScale}
      onValueChange={(v) => {
        const { floatValue } = v
        onChange(floatValue);
      }}
      slotProps={{
        input: {
          autoFocus,
        }
      }}
    />
  )
})

export default NumberField;