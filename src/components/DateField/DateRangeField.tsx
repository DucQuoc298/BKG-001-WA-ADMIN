import { forwardRef, useEffect, useMemo, useState } from "react";
import { MultiInputDateRangeField } from "@mui/x-date-pickers-pro";
import { TextFieldProps } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import DateRangePicker from "components/@extended/DateRangePicker";

interface IDateRangeFieldProps {
  onChange?: (val: [Dayjs | null, Dayjs | null] | any) => void;
  onBlur?: () => void;
  textFieldProps?: Omit<TextFieldProps, "onChange" | "onBlur">;
  label?: string;
  error?: boolean | string;
  helperText?: string;
  defaultValue?: [any, any] | null;
  value?: [any, any] | null;
  required?: boolean;
  name?: string;
}

const DateRangeField = forwardRef<HTMLInputElement, IDateRangeFieldProps>(function DateRangeField(props, ref) {
  const { label, defaultValue, value: controlledValue, onChange, onBlur, error, helperText, required, name, ...rest } = props;



  const parseValue = (val: any): [Dayjs | null, Dayjs | null] => {
    if (!val || !Array.isArray(val)) return [null, null];
    return [
      val[0] ? (dayjs.isDayjs(val[0]) ? val[0] : dayjs(val[0])) : null,
      val[1] ? (dayjs.isDayjs(val[1]) ? val[1] : dayjs(val[1])) : null,
    ];
  };

  const [localValue, setLocalValue] = useState<[Dayjs | null, Dayjs | null]>(() => parseValue(defaultValue));

  const activeValue = useMemo(() => {
    const rawValue = controlledValue !== undefined ? controlledValue : localValue;
    return parseValue(rawValue);
  }, [controlledValue, localValue]);

  const handleChange = (newValue: [Dayjs | null, Dayjs | null]) => {
    const safeValue = newValue || [null, null];
    setLocalValue(safeValue);
    if (onChange) {
      if (name) {
        onChange({
          target: {
            name,
            value: safeValue,
          },
        });
      } else {
        onChange(safeValue);
      }
    }
  };

  const handleBlur = () => {
    onBlur?.();
  };

  useEffect(() => {
    setLocalValue(parseValue(defaultValue));
  }, [defaultValue]);

  return (
    <DateRangePicker
      {...rest}
      label={label}
      required={required}
      inputRef={ref}
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