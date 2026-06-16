import { FormHelperText, FormLabel } from "@mui/material";
import { DatePicker, DatePickerProps, DateValidationError, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, useState } from "react";
import inputStyles from "components/Inputs/styles";
import { useTranslation } from "react-i18next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UseFormRegister } from "react-hook-form";


type IDateFieldProps = Omit<DatePickerProps, 'value' | 'onChange'>
  & Omit<ReturnType<UseFormRegister<any>>, 'ref'> & {
    onBlur?: any;
    value?: dayjs.Dayjs | Date | string | null;
    error?: boolean;
    label?: string;
    required?: boolean;
    helperText?: string;
    name?: string;
    ref?: any;
    setValue?: (value: any) => void;
  }

const DateField = forwardRef<HTMLInputElement, IDateFieldProps>(function DateField(
  {
    value,
    onChange,
    onBlur: _onBlur,
    onError,
    label,
    required,
    slotProps,
    minDate = dayjs("1911-01-01"),
    helperText,
    error,
    name,
    setValue: _setValue,
    ...rest
  }: IDateFieldProps,
  _ref
) {
  const iStyles = inputStyles();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [validationError, setValidationError] = useState<DateValidationError | null>(null);

  const [date, setDate] = useState<Dayjs | null>(value ? dayjs(value) : null);

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

  const handleChange = (newValue: Dayjs | null) => {
    if (onChange) {
      if (name) {
        onChange({
          target: {
            name,
            value: newValue,
          },
        });
      }
    }
    setDate(newValue);
  };


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
        value={date}
        onChange={handleChange}
        {...rest}
      />
    </LocalizationProvider>
  );
});

export default DateField;