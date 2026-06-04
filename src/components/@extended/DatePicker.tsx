import React from "react";
import inputStyles from "components/Inputs/styles";
import { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider, DatePickerProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/en-gb';
import { PickerValue } from "@mui/x-date-pickers/internals";
import { FormHelperText, FormLabel } from "@mui/material";

interface IDateTimePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  onChange: (date: Dayjs | null) => void;
  value: Dayjs | null;
  error?: string;
  label?: string;
}

const DateTimePicker = ({ onChange, value, error, label, ...rest }: IDateTimePickerProps) => {
  const iStyles = inputStyles();
  const isInvalidDate = value ? !value.isValid() : false;
  const hasError = Boolean(error) || isInvalidDate;

  return (
    <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterDayjs}>
      <FormLabel sx={{...iStyles.labelDefault}}>{label}</FormLabel>
      <DatePicker
        slotProps={{
          textField: {
            variant: "outlined",
            fullWidth: true,
            sx: { 
              "& .MuiPickersOutlinedInput-root": { 
                ...iStyles.textfield,
                padding: '0px 10px',
               },
              "& .MuiPickersSectionList-root":{
                padding: '10px 0px !important',
              },
              
            },
            error: hasError,
          },
        }}
        defaultValue={value as PickerValue}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <FormHelperText error id="helper-text-company-signup">
        {error}
      </FormHelperText>}
    </LocalizationProvider>
  );
};

export default DateTimePicker;