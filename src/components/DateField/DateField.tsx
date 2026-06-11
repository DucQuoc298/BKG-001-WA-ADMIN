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
  error?: string,
  helperText?: string,
}

const DateField = forwardRef<HTMLInputElement, IDateFieldProps>(function DateField(
  props,
  ref
) {
  const { type = "date", label, name, defaultValue, onChange, error, helperText } = props;

  const defaultValueAfterConverted = useMemo(() => {
    const d = dayjs(defaultValue);
    if (!defaultValue) return null;
    if (d.format("YYYY-MM-DD") === "1911-01-01") return null;
    return d;
  }, [defaultValue]);

  const [value, setValue] = useState(defaultValueAfterConverted);

  const handleChange = (newValue) => {
    if (!newValue) {
      onChange?.({
        target: {
          name,
          value: null
        }
      })
      setValue(null);
      return;
    }

    onChange?.({
      target: {
        name,
        value: newValue
      }
    })
    setValue(newValue);
  }

  const handleBlur = (_e) => {
    if (value !== null) {
      onChange?.({
        target: {
          name,
          value
        },
        type: "blur"
      })
    } else {
      onChange?.({
        target: {
          name,
          value: null,
        },
        type: "blur",
      });
    }
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
          onBlur: (e) => {
            handleBlur(e);
          },
        }
      }}
      views={type === "month" ? ['year', 'month'] : undefined}
    />
  )
})

export default DateField;