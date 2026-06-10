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
}

type InputDateRangeType = [Dayjs | null, Dayjs | null] | null;

const DateFieldMultiple = forwardRef<HTMLInputElement, IDateRangeFieldProps>(function DateFieldMultiple(props, ref) {
  const { label, name, defaultValue, onChange, error } = props;

  const defaultValueAfterConverted = useMemo<InputDateRangeType>(() => {
    if (!defaultValue) return [null, null];
    const dStart = dayjs(defaultValue?.[0]);
    const dEnd = dayjs(defaultValue?.[1]);
    if (dStart.format("YYYY-MM-DD") === "1911-01-01" && dEnd.format("YYYY-MM-DD") === "1911-01-01") return [null, null];
    return [dStart, dEnd];
  }, [defaultValue]);

  const [value, setValue] = useState<InputDateRangeType>(defaultValueAfterConverted ?? [null, null]);
  const handleChange =(newValue) => {
    setValue(newValue);
    onChange?.({
        target: {
          name,
          value: newValue
        }
      })
  }

  const handleBlur = () => {
    onChange?.({
      target: {
        name,
        value,
      },
      type: "blur",
    });
  };
  useEffect(() => {
    setValue(defaultValueAfterConverted);
  }, [defaultValueAfterConverted]);

  return (
    <DateRangePicker 
      {...props}
      label={label}
      inputRef={ref}
      defaultValue={defaultValueAfterConverted ?? undefined}
      value={value}
      onChange={handleChange}
      slots={{ field: MultiInputDateRangeField }}
      slotProps={{
        textField: {
          onBlur: () => {
            handleBlur();
          },
        }
      }}
      error={error}
    />
  )
})

export default DateFieldMultiple;