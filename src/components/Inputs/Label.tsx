import { FormLabel, Typography } from "@mui/material"
import React from "react";
import inputStyles from "./styles";
interface ILabelProps {
  required?: boolean;
  label?: string;
}
const Label = ({ required, label }: ILabelProps) => {
  const iStyles = inputStyles();
  return (
    <FormLabel sx={{ ...iStyles.labelDefault }} focused={false}>
      {label}
      {required && <Typography sx={{ color: "error.main", height: '100%' }}>*</Typography>}
    </FormLabel>
  )
}

export default Label;