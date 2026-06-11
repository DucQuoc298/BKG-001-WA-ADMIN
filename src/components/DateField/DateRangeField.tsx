import { forwardRef, useEffect, useMemo, useState } from "react";
import { MultiInputDateRangeField } from "@mui/x-date-pickers-pro";
import { TextFieldProps } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import DateRangePicker from "components/@extended/DateRangePicker";

interface IDateRangeFieldProps {
  onChange?: (val: [Dayjs | null, Dayjs | null]) => void;
  onBlur?: () => void;
  textFieldProps?: Omit<TextFieldProps, "onChange" | "onBlur">;
  label?: string;
  error?: boolean | string;
  helperText?: string;
  defaultValue?: [Dayjs | null, Dayjs | null] | null;
  value?: [Dayjs | null, Dayjs | null] | null;
  required?: boolean;
  name?: string;
}

const DateRangeField = forwardRef<HTMLInputElement, IDateRangeFieldProps>(function DateRangeField(props, ref) {
  const { label, defaultValue, value: controlledValue, onChange, onBlur, error, helperText, required, ...rest } = props;

  const defaultValueAfterConverted = useMemo<[Dayjs | null, Dayjs | null]>(() => {
    if (!defaultValue) return [null, null];
    const dStart = dayjs(defaultValue[0]);
    const dEnd = dayjs(defaultValue[1]);
    return [dStart.isValid() ? dStart : null, dEnd.isValid() ? dEnd : null];
  }, [defaultValue]);

  const [localValue, setLocalValue] = useState<[Dayjs | null, Dayjs | null]>(defaultValueAfterConverted);

  const activeValue = controlledValue !== undefined ? controlledValue : localValue;

  const handleChange = (newValue: [Dayjs | null, Dayjs | null]) => {
    const safeValue = newValue || [null, null];
    setLocalValue(safeValue);
    onChange?.(safeValue);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  useEffect(() => {
    setLocalValue(defaultValueAfterConverted);
  }, [defaultValueAfterConverted]);

  return (
    <DateRangePicker
      {...rest}
      label={label}
      required={required}
      // inputRef={ref} // DateRangePicker in extended components has custom input handling
      value={activeValue as any}
      onChange={handleChange as any}
      slots={{ field: MultiInputDateRangeField }}
      slotProps={{
        textField: {
          onBlur: handleBlur,
        },
      }}
      error={Boolean(error)}
      helperText={helperText}
    />
  );
});

export default DateRangeField;