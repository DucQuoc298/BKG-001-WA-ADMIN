import { TextFieldProps } from "@mui/material";
import { DatePickerProps } from "@mui/x-date-pickers";
import { DatePicker } from "components";
import dayjs from "dayjs";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { UseFormRegister } from "react-hook-form";


type IDateFieldProps = Omit<DatePickerProps, "onChange" | "label"> & ReturnType<UseFormRegister<any>> & {
  type?: "date" | "month",
  textFieldProps?: Omit<TextFieldProps, "onChange" | "onBlur">,
  label?: string,
  error?: boolean,
  helperText?: string,
  onBlur?: () => void,
}

const DateField = forwardRef<HTMLInputElement, IDateFieldProps>(function DateField(
  props,
  ref
) {
  const { type = "date", label, defaultValue, onChange, onBlur, error, helperText } = props;

  const defaultValueAfterConverted = useMemo(() => {
    const d = dayjs(defaultValue);
    if (!defaultValue) return null;
    if (d.format("YYYY-MM-DD") === "1911-01-01") return null;
    return d;
  }, [defaultValue]);

  const [value, setValue] = useState(defaultValueAfterConverted);

  const handleChange = (newValue) => {
    setValue(newValue);
    onChange?.(newValue)
  }

  const handleBlur = () => {
    onBlur?.();
  }

  useEffect(() => {
    setValue(defaultValueAfterConverted);
  }, [defaultValueAfterConverted]);

  return (
    <DatePicker
      {...props}
      label={label}
      inputRef={ref}
      defaultValue={defaultValueAfterConverted}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      slotProps={{
        textField: {
          onBlur: handleBlur,
        }
      }}
      views={type === "month" ? ['year', 'month'] : undefined}
    />
  )
})

export default DateField;