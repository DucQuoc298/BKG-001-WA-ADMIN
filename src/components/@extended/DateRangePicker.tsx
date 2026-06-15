import React, { useState } from "react";
import inputStyles from "components/Inputs/styles";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/en-gb';
import 'dayjs/locale/vi';
import { FormHelperText, FormLabel, IconButton, InputAdornment } from "@mui/material";
import { DateRangePickerProps, DateRangePicker, DateRangeValidationError, LocalizationProvider } from "@mui/x-date-pickers-pro";
import Icons, { IconName } from "assets/Icon";
import { useTranslation } from "react-i18next";

interface IDateRangePickerProps extends Omit<DateRangePickerProps, 'value' | 'onChange'> {
  onChange: (date: [Dayjs | null, Dayjs | null]) => void;
  value: [Dayjs | null, Dayjs | null];
  error?: boolean;
  label?: string;
  required?: boolean;
  helperText?: string;
  inputRef?: React.Ref<any>;
}

const DateTimeRangePicker = ({ onChange, value, error, label, slotProps, required, helperText, minDate = dayjs("1911-01-01"), onError, inputRef, ...rest }: IDateRangePickerProps) => {
  const iStyles = inputStyles();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dateRangeError, setDateRangeError] = useState<DateRangeValidationError>([null, null]);

  const currentLocale = i18n.language === 'vi' ? 'vi' : 'en-gb';

  const getValidationMessage = (reason: DateRangeValidationError[number]) => {
    if (reason === 'minDate') return t("errors.min_date");
    if (reason === 'invalidDate') return t("errors.invalid_date");
    return "";
  };

  const getHelperText = (position: 'start' | 'end') => {
    if (helperText) return helperText;
    const e = dateRangeError[position === 'start' ? 0 : 1];
    return getValidationMessage(e);
  };

  const getFieldError = (position: 'start' | 'end') =>
    Boolean(error) || dateRangeError[position === 'start' ? 0 : 1] !== null;

  return (
    <LocalizationProvider adapterLocale={currentLocale} dateAdapter={AdapterDayjs}>
      <FormLabel sx={{ ...iStyles.labelDefault }}>{label}{required && <FormHelperText component="span" sx={{ color: "error.main", paddingLeft: 0.5, height: '100%' }}>*</FormHelperText>}</FormLabel>
      <DateRangePicker
        minDate={minDate}
        slotProps={{
          ...slotProps,
          textField: ({ position }: any) => ({
            ...slotProps?.textField,
            inputRef: position === 'start' ? inputRef : undefined,
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
                        sx={{
                          ...iStyles.clearButton,
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
            error: getFieldError(position),
            helperText: getHelperText(position),
            sx: {
              "& .MuiPickersOutlinedInput-root": {
                ...iStyles.textfield,
                padding: '0px 10px',
              },
              "& .MuiPickersSectionList-root": {
                padding: '10px 0px !important',
              },
            },
          }),
        }}
        value={value}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        onChange={onChange}
        onError={(newError, context) => {
          setDateRangeError(newError);
          onError?.(newError, context);
        }}
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default DateTimeRangePicker;