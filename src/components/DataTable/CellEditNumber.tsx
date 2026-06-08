import React, { memo, useRef, forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { SxProps, TextField } from "@mui/material";
import { GridEditInputCellProps, GridApiPro } from "@mui/x-data-grid-pro";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils";
import createStyle from "./styles";

type ICellEditNumber = GridEditInputCellProps &
  Omit<NumericFormatProps, "onChange" | "onBlur"> & {
    apiRef: React.MutableRefObject<GridApiPro>;
    rowId: any;
    field: string;
    isAbs?: boolean;
    handleChange?: (v, detail) => void;
  };
const CellEditNumber = forwardRef<HTMLInputElement, ICellEditNumber>(
  function Input(
    {
      value,
      thousandSeparator = ",",
      decimalSeparator = ".",
      decimalScale = 2,
      isAbs = true,
      apiRef,
      rowId,
      field,
      hasFocus,
      handleChange,
      api,
      // Extract props that should not be passed to NumericFormat
      id: _id,
      className: _className,
      tabIndex: _tabIndex,
      inputProps: _inputProps,
      InputProps: _InputProps,
      slotProps: _slotProps,
      ...numericFormatProps
    },
    ref
  ) {
    const [currency, setCurrency] = React.useState(value);
    const styles = createStyle();
    const inputRef = useRef<HTMLInputElement>(null);

    useEnhancedEffect(() => {
      if (hasFocus) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [hasFocus, ref]);

    return (
      <NumericFormat
        {...numericFormatProps}
        value={currency}
        sx={styles.baseInputEdit as SxProps}
        variant="outlined"
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        decimalScale={decimalScale}
        getInputRef={(el) => {
          if (el && "select" in el) {
            inputRef.current = el as HTMLInputElement;
          } else if (el) {
            const input = (el as any).querySelector("input");
            if (input) inputRef.current = input;
          }
        }}
        customInput={TextField}
        onValueChange={(e) => {
          const { floatValue = 0 } = e;
          const app = apiRef?.current ?? api;
          app.setEditCellValue({
            id: rowId,
            field: field,
            value: floatValue,
          });
          // updateRow(app, rowId, {
          //   [field]: isAbs ? Math.abs(floatValue) : floatValue,
          // });
          handleChange?.(floatValue, rowId);
          setCurrency(e.value);
        }}
        allowNegative={!isAbs}
      // onKeyDown={(e) => {
      //   if (e.key === "-" && isAbs === true) {
      //     e.preventDefault();
      //   }
      // }}
      />
    );
  }
);

export default memo(CellEditNumber);
