import React, { forwardRef, useRef, memo } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { GridEditInputCellProps, GridApiPro } from "@mui/x-data-grid-pro";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils";
import { updateRow } from "utils";
import createStyle from "./styles";

type IEditTextField = GridEditInputCellProps &
  Omit<TextFieldProps, "onChange" | "onBlur"> & {
    apiRef: React.RefObject<GridApiPro>;
    rowId: any;
    field: string;
  };

const CellEditText = forwardRef<HTMLInputElement, IEditTextField>(
  function Input(
    { value, hasFocus, multiline = false, apiRef, rowId, field,
      api,
      ...props },
    ref
  ) {
    const styles = createStyle();
    const inputRef = useRef<HTMLInputElement>(null);

    useEnhancedEffect(() => {
      if (hasFocus) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [hasFocus]);
    return (
      <TextField
        ref={ref}
        inputRef={inputRef}
        {...props}
        sx={styles.baseInputEdit}
        onFocus={(e) =>
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length
          )
        }
        onChange={(e) => {
          const app = apiRef?.current ?? api;
          app.setEditCellValue({
            id: rowId,
            field: field,
            value: e.target.value,
          });
          updateRow(app, rowId, {
            [field]: e.target.value,
          });
        }}
        value={value}
        multiline={multiline}
      />
    );
  }
);

export default memo(CellEditText);
