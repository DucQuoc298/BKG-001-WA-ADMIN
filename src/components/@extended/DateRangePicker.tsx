import React, { useState } from "react";
import inputStyles from "components/Inputs/styles";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/en-gb';
import { FormHelperText, FormLabel, IconButton, InputAdornment } from "@mui/material";
import { DateRangePickerProps, DateRangePicker } from "@mui/x-date-pickers-pro";
import { PickerRangeValue } from "@mui/x-date-pickers/internals";
import Icons, { IconName } from "assets/Icon";

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
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterDayjs}>
      <FormLabel sx={{...iStyles.labelDefault}}>{label}{required && <FormHelperText component="span" sx={{ color: "error.main", paddingLeft: 0.5, height: '100%' }}>*</FormHelperText>}</FormLabel>
      <DateRangePicker
        slotProps={{
          ...slotProps,
          textField: ({ position }) => ({
            ...slotProps?.textField,
            slotProps: {
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {(value?.[0] || value?.[1]) && (
                      <IconButton
                        onClick={() => {
                          if (position === "start") {
                            onChange([null, value?.[1] ?? null]);
                          } else {
                            onChange([value?.[0] ?? null, null]);
                          }
                        }}
                        className="clear-range-btn"
                        sx={{
                          padding: "0px !important",
                          marginRight: "4px",
                        }}
                      >
                        <Icons name={IconName.CLEAR} size={20} />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => setOpen(true)}
                      sx={{
                        padding: '0px !important',
                      }}
                    >
                      <Icons name={IconName.CALENDAR} size={26} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
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
              "& .clear-range-btn": {
                opacity: 0,
                pointerEvents: "none",
                transition: "opacity 0.15s ease",
              },
              "&:hover .clear-range-btn, & .Mui-focused .clear-range-btn": {
                opacity: 1,
                pointerEvents: "auto",
              },
            },
            error: hasError,
          }),
        }}
        defaultValue={value as PickerRangeValue}
        value={value}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
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