import dayjs, { Dayjs } from "dayjs";
import React, { forwardRef, useState } from "react";
import { MultiInputDateRangeField } from "@mui/x-date-pickers-pro";
import DateRangePicker from "components/@extended/DateRangePicker";
import { UseFormRegister } from "react-hook-form";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

// ============================================================
// FIX: MUI X bug — MultiInputDateRangeField nội bộ dùng
// <Stack alignItems="baseline" {...props}> nhưng Stack
// forward `alignItems` xuống DOM → React warning.
// Override root slot bằng styled Stack có shouldForwardProp.
// ============================================================

const SafeFieldRoot = styled(
  React.forwardRef<HTMLDivElement, any>(function SafeFieldRoot(props, ref) {
    const { alignItems, ...rest } = props;
    return <Stack ref={ref} sx={{ gap: 2, direction: "row", alignItems: "center" }} {...rest} />;
  }),
  {
    shouldForwardProp: (prop) => prop !== 'alignItems',
  }
)({});

// ============================================================
// TYPE
// ============================================================

/**
 * Props của DateRangeField — tuân thủ cùng pattern với DateField:
 * - Extend từ ReturnType<UseFormRegister<any>> (bỏ 'ref') để có thể
 *   dùng trực tiếp với {...register('fieldName')} của React Hook Form.
 * - `onChange` sẽ nhận sự kiện dạng { target: { name, value } }
 *   để tương thích với cơ chế đăng ký của RHF.
 */
type IDateRangeFieldProps = Omit<ReturnType<UseFormRegister<any>>, 'ref'> & {
  onBlur?: any;
  value?: [any, any] | null;
  error?: boolean;
  label?: string;
  required?: boolean;
  helperText?: string;
  name?: string;
  ref?: any;
};

// ============================================================
// COMPONENT
// ============================================================

/**
 * DateRangeField — Input chọn khoảng ngày tháng tích hợp với React Hook Form.
 *
 * Cách dùng:
 * ```tsx
 * <DateRangeField label="Date range" {...register('dateRange')} />
 * ```
 *
 * Hoặc với Controller nếu cần kiểm soát chi tiết hơn:
 * ```tsx
 * <Controller name="dateRange" control={control}
 *   render={({ field }) => <DateRangeField {...field} />}
 * />
 * ```
 *
 * Cơ chế hoạt động:
 * - Khi người dùng chọn ngày, `handleChange` emit sự kiện dạng
 *   `{ target: { name, value: [Dayjs, Dayjs] } }` – tương thích
 *   với cách RHF lắng nghe thay đổi qua `register`.
 * - State nội bộ `[date, setDate]` dùng để hiển thị giá trị trên
 *   picker, đồng bộ với `value` prop đến từ Redux/RHF.
 */
const DateRangeField = forwardRef<HTMLInputElement, IDateRangeFieldProps>(function DateRangeField(
  {
    value,
    onChange,
    onBlur: _onBlur,
    error,
    label,
    required,
    helperText,
    name,
  }: IDateRangeFieldProps,
  _ref
) {
  /** Chuyển đổi giá trị bất kỳ (string, Date, Dayjs, null) về [Dayjs | null, Dayjs | null] */
  const parseValue = (val: any): [Dayjs | null, Dayjs | null] => {
    if (!val || !Array.isArray(val)) return [null, null];
    return [
      val[0] ? (dayjs.isDayjs(val[0]) ? val[0] : dayjs(val[0])) : null,
      val[1] ? (dayjs.isDayjs(val[1]) ? val[1] : dayjs(val[1])) : null,
    ];
  };

  /** State nội bộ hiển thị giá trị trên picker — được khởi tạo từ value prop */
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>(
    () => parseValue(value)
  );

  /**
   * Xử lý khi người dùng chọn ngày mới.
   * Emit theo định dạng { target: { name, value } } để React Hook Form
   * nhận và cập nhật vào store thông qua register.
   */
  const handleChange = (newValue: [Dayjs | null, Dayjs | null]) => {
    const safeValue = newValue || [null, null];
    setDateRange(safeValue);

    if (onChange) {
      if (name) {
        onChange({
          target: {
            name,
            value: safeValue,
          },
        });
      } else {
        onChange(safeValue as any);
      }
    }
  };

  return (
    <DateRangePicker
      label={label}
      required={required}
      value={dateRange}
      onChange={handleChange}
      slots={{
        field: MultiInputDateRangeField,
      }}
      slotProps={{
        field: {
          slots: {
            root: SafeFieldRoot,
          },
        } as any,
      }}
      error={Boolean(error)}
      helperText={helperText}
    />
  );
});

export default DateRangeField;