import React, {
  memo,
  useEffect,
  useState,
  forwardRef,
  useRef,
  useCallback,
  UIEvent,
} from "react";
import {
  TextField,
  Autocomplete as MuiAutocomplete,
  AutocompleteProps,
} from "@mui/material";
import { GridEditInputCellProps, GridApiPro } from "@mui/x-data-grid-pro";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils";
import { updateRow } from "utils";
import { useAutocomplete } from "hooks";
import { useTranslation } from "react-i18next";
import createStyle from "../../styles";

const emptyGuid = "00000000-0000-0000-0000-000000000000";
const isValidUUID = (val: string) => 
  typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

type ICellEditAutocomplete = GridEditInputCellProps &
  Omit<
    AutocompleteProps<any, boolean, boolean, any>,
    "options" | "renderInput"
  > & {
    apiRef?: React.MutableRefObject<GridApiPro>;
    rowId: any;
    field: string;
    idField?: string;
    textField?: string;
    createFilterField?: string;
    logKey?: string;
    store: {
      data?: any[];
      params?: any;
      fnGetData?: (params: any, onSuccess?: (result: any) => void) => void;
      mode?: "local" | "remote";
      cacheKey?: string;
    };
    handleChange?: (selectedRecord: any, rowId: any, field?: string) => void;
    autoRowHeight?: boolean;
    onTabNavigation?: (rowId: any, field: string, isShift: boolean, event: any) => void;
  };

const CellEditAutocomplete = forwardRef<
  HTMLInputElement,
  ICellEditAutocomplete
>(function Input(
  {
    idField = "id",
    textField = "text",
    createFilterField: _createFilterField = textField,
    store,
    handleChange,
    logKey: _logKey = "",
    onBlur,
    apiRef,
    rowId,
    field,
    hasFocus,
    disabled,
    api,
    value: initialValue,
    autoRowHeight,
    onTabNavigation,
    // Omit DataGrid cell props to avoid DOM warnings
    cellMode: _cellMode,
    row: _row,
    rowNode: _rowNode,
    colDef: _colDef,
    isEditable: _isEditable,
    formattedValue: _formattedValue,
    ...props
  },
  ref
) {
  const { t } = useTranslation();
  const { mode = "local" } = store;
  const styles = createStyle();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");

  // Pagination pageSize
  const pageSize = 7;

  // Build params for hook
  const effectiveParams = React.useMemo(() => {
    if (mode !== "remote") return store.params;
    return {
      ...(store.params ?? {}),
      keyword: searchKeyword.trim().length > 0 ? searchKeyword : store.params?.keyword,
    };
  }, [mode, store.params, searchKeyword]);

  // Hook to handle autocomplete loading and scrolling
  const cacheKey = store.cacheKey || `${rowId}-${field}-edit`;
  const { options, loading, loadNextPage } = useAutocomplete<any>({
    cacheKey,
    mode,
    data: store.data,
    params: effectiveParams,
    fnGetData: store.fnGetData,
    pageSize,
  });

  // Resolve initial selected option on mount
  useEffect(() => {
    const app = apiRef?.current ?? api;
    const cellValue = initialValue !== undefined ? initialValue : app.getRow(rowId)?.[field];

    if (!cellValue || cellValue === emptyGuid) {
      setSelectedOption(null);
      setInputValue("");
      return;
    }

    // Attempt to resolve instantly from options if already loaded
    if (options && options.length > 0) {
      const cachedItem = options.find((option: any) => option[idField] === cellValue);
      if (cachedItem) {
        setSelectedOption(cachedItem);
        setInputValue(cachedItem[textField] ?? "");
        return;
      }
    }

    if (mode === "local") {
      const item = store.data?.find((option) => option[idField] === cellValue);
      if (item) {
        setSelectedOption(item);
        setInputValue(item[textField] ?? "");
      }
    } else if (mode === "remote" && store.fnGetData) {
      // Fetch initial option by its ID
      const filterParams: any = [];
      if (isValidUUID(cellValue)) {
        filterParams.push({ property: idField, value: cellValue, method: "eq" });
      }
      store.fnGetData(
        {
          ...(store.params ?? {}),
          filter: filterParams,
          searchString: cellValue,
          page: 0,
          pageSize: 1,
        },
        (result: any) => {
          const list = Array.isArray(result)
            ? result
            : (result?.data ?? (Array.isArray(result?.data?.data) ? result.data.data : []));
          if (Array.isArray(list)) {
            const item = list.find((option) => option[idField] === cellValue);
            if (item) {
              setSelectedOption(item);
              setInputValue(item[textField] ?? "");
            }
          }
        }
      );
    }
  }, [initialValue, rowId, field, mode, store.data, idField, options, textField]);

  useEnhancedEffect(() => {
    if (hasFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [hasFocus]);

  const updateValue = useCallback(
    (record: any) => {
      const v = record && record[idField] ? record[idField] : null;
      const text = record && record[textField] ? record[textField] : "";
      const app = apiRef?.current ?? api;
      
      app.setEditCellValue({
        id: rowId,
        field,
        value: v,
      });

      updateRow(app, rowId, { [textField]: text, [field]: v });
      setSelectedOption(record);
      setInputValue(text);
    },
    [apiRef, api, rowId, field, idField, textField]
  );

  const handleScroll = useCallback(
    (event: UIEvent<HTMLElement>) => {
      const el = event.currentTarget;
      const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
      if (isBottom && !loading) {
        loadNextPage();
      }
    },
    [loading, loadNextPage]
  );

  const handleInputChange = useCallback(
    (_event: any, newInputValue: string, reason: string) => {
      setInputValue(newInputValue);
      if (mode !== "remote") return;
      if (reason === "input") {
        setSearchKeyword(newInputValue);
      } else if (reason === "clear") {
        setSearchKeyword("");
      }
    },
    [mode]
  );

  return (
    <MuiAutocomplete
      ref={ref}
      {...(props as any)}
      onKeyDown={(e) => {
        if (e.key === 'Tab') {
          onTabNavigation?.(rowId, field, e.shiftKey, e);
        } else {
          props.onKeyDown?.(e);
        }
      }}
      sx={{
        ...styles.baseInputEdit,
        ...(autoRowHeight ? {
          height: "auto",
          "& .MuiInputBase-root": {
            height: "auto !important",
            minHeight: "unset",
          }
        } : {})
      }}
      disabled={disabled}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={selectedOption}
      inputValue={inputValue}
      onChange={(_e, v) => {
        updateValue(v);
        setOpen(false);
        handleChange?.(v, rowId, field);
      }}
      onInputChange={handleInputChange}
      onBlur={onBlur}
      selectOnFocus
      clearOnBlur
      options={options}
      loading={loading}
      noOptionsText={t("text.no_options")}
      getOptionLabel={(option: any) => {
        if (typeof option === "string") return option;
        return option ? option[textField] : "";
      }}
      isOptionEqualToValue={(option: any, val: any) =>
        option?.[idField] === val?.[idField]
      }
      slotProps={{
        clearIndicator: {
          tabIndex: -1,
        },
        popupIndicator: {
          tabIndex: -1,
        },
        listbox: {
          onScroll: handleScroll,
          style: {
            maxHeight: "185px",
            fontSize: "14px",
            overflow: "auto",
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          variant="outlined"
        />
      )}
    />
  );
});

export default memo(CellEditAutocomplete);
