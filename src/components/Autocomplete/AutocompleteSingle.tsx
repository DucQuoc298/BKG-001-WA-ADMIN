import { forwardRef, useEffect, useMemo, useRef, useState, useTransition, type UIEvent, } from "react";
import {
  AutocompleteRenderInputParams,
  debounce,
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
} from "@mui/material";
import { AutocompleteProps } from ".";
import styles from "./styles";
import { TextField } from "components";
import { useAutocomplete } from "hooks";
import Icons, { IconName } from "assets/Icon";
import { useTranslation } from "react-i18next";

export const AutocompleteSingle = forwardRef<
  HTMLInputElement,
  AutocompleteProps
>(function AutocompleteSingle(props, ref) {
  const {
    store,
    label,
    idField = 'id',
    textField = 'text',
    error,
    helperText,
    required,
    forceSelection,
    name,
    onChange,
    onBlur,
    ...rest
  } = props;
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [ipValue, setIpValue] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  
  const {
    data,
    params: storeParams,
    fnGetData,
    mode = "local",
  } = store
  const optionIdField = idField || "id";
  const optionTextField = textField || "text";
  const pageSize = 7;
    const effectiveParams = useMemo(() => {
      if (mode !== "remote") {
        return storeParams;
      }
  
      const baseParams = storeParams ?? {};
  
      return {
        ...baseParams,
        page: 0,
        keyword: baseParams.keyword,
      };
    }, [mode, storeParams]);
  const cacheKey =
    (store as any).cacheKey ||
    `${name || label || "autocomplete"}:${optionIdField}:${optionTextField}`;

    const {
      options,
      loading,
      loadNextPage,
    } = useAutocomplete<any>({
      cacheKey,
      mode,
      data,
      params: effectiveParams,
      fnGetData,
      pageSize,
    });

  // Fetch options when params change in remote mode
  useEffect(() => {
    if (mode === "remote" && fnGetData) {
      fnGetData(storeParams || {}, (data) => {
        // No need to set options here as useAutocomplete handles it
        // setOptions(data);
      });
    }
  }, [storeParams, fnGetData, mode]);

    const handleScroll = (event: UIEvent<HTMLElement>) => {
    const listboxNode = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = listboxNode;

    const isBottom = scrollTop + clientHeight >= scrollHeight - 5;

    if (isBottom && !loading) {
      loadNextPage();
    }
  };

  const externalSlotProps = (rest as any).slotProps;
  const externalListboxSlotProps = externalSlotProps?.listbox ?? {};

  const mergedSlotProps = {
    ...externalSlotProps,
    listbox: {
      ...externalListboxSlotProps,
      style: {
        maxHeight: "200px",
        overflow: "auto",
        ...externalListboxSlotProps.style,
      },
      onScroll: (event: UIEvent<HTMLElement>) => {
        externalListboxSlotProps.onScroll?.(event);
        handleScroll(event);
      },
    },
  };

  // const handleChange: MuiAutocompleteProps<any, false, boolean, any>["onChange"] = (event, value) => {
  //   if (forceSelection && value) {
  //     const matchedOption = options.find(
  //       (option) => option[optionIdField] === value[optionIdField]
  //     );
  //     if (!matchedOption) {
  //       value = null;
  //     }
  //   }

  //   if (onChange) {
  //     if (typeof onChange === "function") {
  //       onChange(event, value);
  //     } else {
  //       onChange({
  //         target: { name, value },
  //         type: "change",
  //       });
  //     }
  //   }
  // };

  const handleInputChange: MuiAutocompleteProps<any, false, boolean, any>["onInputChange"] = ( event, value) => {
    event.preventDefault();
    if(!value){
      setIpValue(null);
    }
    if(mode === "remote" && fnGetData){
      startTransition(() => {
        const filter: any = [];
        if(storeParams && storeParams.filter){
          filter.push(storeParams.filter);
        } 
        if (value) filter.push({ property: textField, value, method: "like" });
        fnGetData(
         { ...storeParams, filter, page: 0, pageSize }, (result) => {
          console.log("Fetched options:", result);
        }
      );
      });

    }
  };
  const debounce = (func, timeout = 300) => {
    let timer;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(debounce, args);
      }, timeout);
    };
  };

  const debouncedHandleInputChange = debounce(handleInputChange, 700);

  // For demonstration, we'll just render the label and a simple input
  return (
    <MuiAutocomplete
     {...rest}
     ref={ref}
    sx={{
      ...styles.autocomplete,
      ...rest.sx,
    }}
    slotProps={mergedSlotProps}
    autoHighlight
    selectOnFocus
    // onChange={handleChange}
    noOptionsText={t("text.no_options")}
    options={options}
    clearOnBlur
    getOptionLabel={(option) => option[textField] ?? ""}
    clearIcon={<Icons name={IconName.CLOSE} size={14} />}
    renderInput={(inputParams) => (
      <TextField
        {...inputParams}
        ref={inputRef}
        onChange={debouncedHandleInputChange}
        required={required}
        label={label}
        error={error}
        helperText={helperText}
      />
    )}  
    />
  )});
