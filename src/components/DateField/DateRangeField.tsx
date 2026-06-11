import { forwardRef, useEffect, useMemo, useState } from "react";
import { DateRangePickerProps, MultiInputDateRangeField } from "@mui/x-date-pickers-pro";
import { UseFormRegister } from "react-hook-form";
import { TextFieldProps } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import DateRangePicker from "components/@extended/DateRangePicker";

type IDateRangeFieldProps  = Omit<DateRangePickerProps, "onChange" | "label"> & ReturnType<UseFormRegister<any>> & {
  textFieldProps?: Omit<TextFieldProps, "onChange" | "onBlur">,
  label?: string,
  error?: string,
  helperText?: string,
  onBlur?: () => void,
}

type InputDateRangeType = [Dayjs | null, Dayjs | null] | null;

const DateRangeField = forwardRef<HTMLInputElement, IDateRangeFieldProps>(function DateRangeField(props, ref) {
  const { label, defaultValue, onChange, onBlur, error, helperText } = props;

  const defaultValueAfterConverted = useMemo<InputDateRangeType>(() => {
    if (!defaultValue) return [null, null];
    const dStart = dayjs(defaultValue?.[0]);
    const dEnd = dayjs(defaultValue?.[1]);
    return [dStart, dEnd];
  }, [defaultValue]);

  const [value, setValue] = useState<InputDateRangeType>(defaultValueAfterConverted ?? [null, null]);
  const handleChange =(newValue) => {
    setValue(newValue);
    onChange?.(newValue)
  }

  const handleBlur = () => {
    onBlur?.();
  };
  useEffect(() => {
    setValue(defaultValueAfterConverted);
  }, [defaultValueAfterConverted]);

  return (
    <DateRangePicker 
      {...props}
      label={label}
      inputRef={ref}
      defaultValue={defaultValueAfterConverted}
      value={value}
      onChange={handleChange}
      slots={{ field: MultiInputDateRangeField }}
      slotProps={{
        textField: {
          onBlur: handleBlur,
        },
      }}
      error={error}
      helperText={helperText}
    />
  )
})

export default DateRangeField;