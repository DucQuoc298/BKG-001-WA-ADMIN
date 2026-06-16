import React, { useState } from "react";
import inputStyles from "components/Inputs/styles";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider, DatePickerProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/en-gb';
import 'dayjs/locale/vi';
import { FormHelperText, FormLabel } from "@mui/material";
import { DateValidationError } from "@mui/x-date-pickers/models";
import { useTranslation } from "react-i18next";

interface IDateTimePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  onChange: (date: Dayjs | null) => void;
  value: Dayjs | null;
  error?: boolean;
  label?: string;
  required?: boolean;
  helperText?: string;
}

const DateTimePicker = ({ onChange, value, error, label, slotProps, required, helperText, minDate = dayjs("1911-01-01"), onError, ...rest }: IDateTimePickerProps) => {
  const iStyles = inputStyles();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [validationError, setValidationError] = useState<DateValidationError | null>(null);

  const getValidationMessage = (reason: DateValidationError | null) => {
    switch (reason) {
      case "invalidDate":
        return t('errors.invalid_date');
      case "minDate":
        return t('errors.min_date');
      default:
        return undefined;
    }
  };
  const resolvedHelperText = helperText || getValidationMessage(validationError);
  const hasError = Boolean(error) || Boolean(validationError);

  return (
    <LocalizationProvider adapterLocale={i18n.language === 'vi' ? 'vi' : 'en-gb'} dateAdapter={AdapterDayjs}>
      <FormLabel sx={{ ...iStyles.labelDefault }}>{label}{required && <FormHelperText component="span" sx={{ color: "error.main", paddingLeft: 0.5, height: '100%' }}>*</FormHelperText>}</FormLabel>
      <DatePicker
        minDate={minDate}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onError={(reason, context) => {
          setValidationError(reason);
          onError?.(reason, context);
        }}
        slotProps={{
          ...slotProps,
          openPickerButton: {
            sx: {
              marginRight: 0,
            },
            ...slotProps?.openPickerButton,
          },
          textField: {
            variant: "outlined",
            fullWidth: true,
            sx: {
              "& .MuiPickersOutlinedInput-root": {
                ...iStyles.textfield,
                padding: '0px 10px',
              },
              "& .MuiPickersSectionList-root": {
                padding: '10px 0px !important',
              },

            },
            ...slotProps?.textField,
            error: hasError,
            helperText: resolvedHelperText,
          },
          field: { clearable: true },
        }}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default DateTimePicker;