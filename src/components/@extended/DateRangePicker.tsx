import React from "react";
import inputStyles from "components/Inputs/styles";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/en-gb';
import { FormHelperText, FormLabel } from "@mui/material";
import { DateRangePickerProps, DateRangePicker } from "@mui/x-date-pickers-pro";
import { PickerRangeValue } from "@mui/x-date-pickers/internals";

interface IDateRangePickerProps extends Omit<DateRangePickerProps, 'value' | 'onChange'> {
  onChange: (date: [Dayjs | null, Dayjs | null]) => void;
  value: [Dayjs | null, Dayjs | null];
  error?: string;
  label?: string;
  required?: boolean;
}

const DateTimeRangePicker = ({ onChange, value, error, label, slotProps, required, ...rest }: IDateRangePickerProps) => {
  const iStyles = inputStyles();
  const hasBothDates = value?.[0] != null && value?.[1] != null;
  const isInvalidRange = hasBothDates && (!value[0]?.isValid() || !value[1]?.isValid());
  const hasError = Boolean(error) || isInvalidRange;

  return (
    <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterDayjs}>
      <FormLabel sx={{...iStyles.labelDefault}}>{label}{required && <FormHelperText component="span" sx={{ color: "error.main", paddingLeft: 0.5, height: '100%' }}>*</FormHelperText>}</FormLabel>
      <DateRangePicker
        slotProps={{
          ...slotProps,
          textField: {
            label: "",
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
            ...slotProps?.textField,
          },
        }}
        defaultValue={value as PickerRangeValue}
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

export default DateTimeRangePicker;