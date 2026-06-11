import { TextFieldProps } from "@mui/material";
import { DatePickerProps } from "@mui/x-date-pickers";
import { DatePicker } from "components";
import dayjs, { Dayjs } from "dayjs";
import { forwardRef, useEffect, useMemo, useState } from "react";

interface IDateFieldProps {
  type?: "date" | "month";
  onChange?: (val: Dayjs | null) => void;
  onBlur?: () => void;
  textFieldProps?: Omit<TextFieldProps, "onChange" | "onBlur">;
  label?: string;
  error?: boolean | string;
  helperText?: string;
  defaultValue?: Dayjs | Date | string | null;
  value?: Dayjs | Date | string | null;
  required?: boolean;
  name?: string;
}

const DateField = forwardRef<HTMLInputElement, IDateFieldProps>(function DateField(
  props,
  ref
) {
  const { type = "date", label, defaultValue, value: controlledValue, onChange, onBlur, error, helperText, required } = props;

  const defaultValueAfterConverted = useMemo(() => {
    if (!defaultValue) return null;
    const d = dayjs(defaultValue);
    if (d.format("YYYY-MM-DD") === "1911-01-01") return null;
    return d.isValid() ? d : null;
  }, [defaultValue]);

  const [localValue, setLocalValue] = useState<Dayjs | null>(defaultValueAfterConverted);

  const activeValue = useMemo(() => {
    if (controlledValue === undefined) return localValue;
    if (!controlledValue) return null;
    const d = dayjs(controlledValue);
    return d.isValid() ? d : null;
  }, [controlledValue, localValue]);

  const handleChange = (newValue: Dayjs | null) => {
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  useEffect(() => {
    setLocalValue(defaultValueAfterConverted);
  }, [defaultValueAfterConverted]);

  return (
    <DatePicker
      {...props}
      label={label}
      required={required}
      defaultValue={defaultValueAfterConverted}
      value={activeValue}
      onChange={handleChange}
      error={Boolean(error)}
      helperText={helperText}
      slotProps={{
        textField: {
          onBlur: handleBlur,
        }
      }}
      views={type === "month" ? ['year', 'month'] : undefined}
    />
  );
});

export default DateField;