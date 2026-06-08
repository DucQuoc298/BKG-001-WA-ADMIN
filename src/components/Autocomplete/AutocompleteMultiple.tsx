// AutocompleteSingle.tsx

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MutableRefObject,
  type Ref,
  type UIEvent,
} from "react";

import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
} from "@mui/material";

import { TextField } from "components";
import Icons, { IconName } from "assets/Icon";
import { useTranslation } from "react-i18next";
import styles from "./styles";
import { AutocompleteProps } from ".";
import { useAutocomplete } from "hooks";

const mergeUniqueOptions = (base: any[], extras: any[] | any, idField: string) => {
  const normalizedExtras = Array.isArray(extras)
    ? extras
    : extras == null
      ? []
      : [extras];

  const map = new Map<any, any>();

  [...base, ...normalizedExtras].forEach((item) => {
    const key = item?.[idField];

    if (key != null) {
      map.set(key, item);
      return;
    }

    map.set(`${JSON.stringify(item)}-${map.size}`, item);
  });

  return Array.from(map.values());
};

const defaultLookupResultCache = new Map<string, any[]>();
const defaultLookupPendingCache = new Map<string, Promise<any[]>>();
const selectedValueCache = new Map<string, any>();


const assignRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (!ref) return;

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  (ref as MutableRefObject<T | null>).current = value;
};

export const AutocompleteMultiple = forwardRef<
  HTMLInputElement,
  AutocompleteProps
>(function AutocompleteMultiple(props, ref) {
  const {
    store,
    label,
    idField,
    textField,
    error,
    helperText,
    required,
    defaultValue = null,
    onChange,
    onBlur,
    name,
    ...muiProps
  } = props;

  const {
    data,
    params: storeParams,
    fnGetData,
    fnGetDefaultData,
    buildDefaultParams,
    mode = "local",
  } = store;

  const { t } = useTranslation();
  

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [fallbackOptions, setFallbackOptions] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const optionIdField = idField || "id";
  const optionTextField = textField || "text";
  const pageSize = 7;

  const cacheKey =
    (store as any).cacheKey ||
    `${name || label || "autocomplete"}:${optionIdField}:${optionTextField}`;

  const effectiveParams = useMemo(() => {
    if (mode !== "remote") {
      return storeParams;
    }

    const baseParams = storeParams ?? {};
    const hasTypedKeyword = searchKeyword.trim().length > 0;

    return {
      ...baseParams,
      page: 0,
      keyword: hasTypedKeyword ? searchKeyword : baseParams.keyword,
    };
  }, [mode, storeParams, searchKeyword]);

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

  const mergedOptions = useCallback(
    () => mergeUniqueOptions(options, fallbackOptions, optionIdField),
    [options, fallbackOptions, optionIdField]
  );

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(ref, node);
    },
    [ref]
  );

  const findDefaultOption = useCallback(
    (items: any[], value: any) => {
      if (value == null) {
        return null;
      }

      if (typeof value === "object") {
        const matched = items.find(
          (option) => option?.[optionIdField] === value?.[optionIdField]
        );

        return matched ?? value;
      }

      return (
        items.find((option) => option?.[optionIdField] === value) ?? null
      );
    },
    [optionIdField]
  );

  useEffect(() => {
    let isActive = true;
    const persistedValue = selectedValueCache.has(cacheKey)
      ? selectedValueCache.get(cacheKey)
      : defaultValue;

    if (persistedValue == null) {
      setSelectedOption(null);
      return () => {
        isActive = false;
      };
    }

    const nextSelectedOption = findDefaultOption(mergedOptions(), persistedValue);

    setSelectedOption(nextSelectedOption);

    if (nextSelectedOption || mode !== "remote") {
      return;
    }

    const lookupKey = JSON.stringify({
      cacheKey,
      defaultValue: persistedValue,
      params: storeParams ?? null,
    });

    const applyFetchedDefaults = (items: any[]) => {
      if (!isActive || items.length === 0) {
        return;
      }

      setFallbackOptions((prev) => mergeUniqueOptions(prev, items, optionIdField));

      const matchedOption = findDefaultOption(items, persistedValue);
      if (matchedOption) {
        setSelectedOption(matchedOption);
      }
    };

    const cachedDefaults = defaultLookupResultCache.get(lookupKey);
    if (cachedDefaults && cachedDefaults.length > 0) {
      applyFetchedDefaults(cachedDefaults);
      return () => {
        isActive = false;
      };
    }

    const lookupDefault = fnGetDefaultData
      ? (onSuccess: (data: any) => void) => {
          if (fnGetDefaultData.length >= 3) {
            return (fnGetDefaultData as (value: any, params: any, onSuccess?: (data: any) => void) => void | Promise<any>)(
              persistedValue,
              storeParams,
              onSuccess
            );
          }

          return (fnGetDefaultData as (value: any, onSuccess?: (data: any) => void) => void | Promise<any>)(
            persistedValue,
            onSuccess
          );
        }
      : fnGetData
        ? (onSuccess: (data: any) => void) => {
            const fallbackParams = buildDefaultParams
              ? buildDefaultParams(persistedValue, storeParams)
              : {
                  ...(storeParams ?? {}),
                  page: 0,
                  pageSize,
                  keyword: String(persistedValue ?? ""),
                  [optionIdField]: persistedValue,
                };

            return fnGetData(fallbackParams, onSuccess);
          }
        : null;

    if (!lookupDefault) {
      return () => {
        isActive = false;
      };
    }

    let pendingLookup = defaultLookupPendingCache.get(lookupKey);

    if (!pendingLookup) {
      pendingLookup = new Promise<any[]>((resolve) => {
        const onResolved = (items: any) => {
          const fetched = Array.isArray(items)
            ? items
            : items == null
              ? []
              : [items];

          if (fetched.length > 0) {
            defaultLookupResultCache.set(lookupKey, fetched);
          }
          resolve(fetched);
        };

        const maybePromise = lookupDefault(onResolved);

        if (maybePromise && typeof (maybePromise as Promise<any>).then === "function") {
          (maybePromise as Promise<any>).then(onResolved).catch(() => resolve([]));
        }
      }).finally(() => {
        defaultLookupPendingCache.delete(lookupKey);
      });

      defaultLookupPendingCache.set(lookupKey, pendingLookup);
    }

    pendingLookup.then((fetched) => {
      applyFetchedDefaults(fetched);
    });

    return () => {
      isActive = false;
    };
  }, [
    defaultValue,
    cacheKey,
    mergedOptions,
    findDefaultOption,
    mode,
    storeParams,
    fnGetDefaultData,
    fnGetData,
    buildDefaultParams,
    pageSize,
    optionIdField,
  ]);

  const handleChange: MuiAutocompleteProps<
    any,
    false,
    false,
    false
  >["onChange"] = (event, value, reason, details) => {
    setSelectedOption(value);

    const nextValue = idField ? value?.[idField] ?? null : value;
    selectedValueCache.set(cacheKey, nextValue);

    const registerOnChange = onChange as
      | ((event: {
          target: {
            name?: string;
            value: any;
          };
          type?: string;
        }) => void)
      | undefined;

    const muiOnChange = onChange as
      | MuiAutocompleteProps<any, false, boolean, any>["onChange"]
      | undefined;

    if (name) {
      registerOnChange?.({
        target: {
          name,
          value: nextValue,
        },
        type: "change",
      });

      return;
    }

    muiOnChange?.(event, nextValue, reason, details);
  };

  const handleInputChange: MuiAutocompleteProps<any, false, false, false>["onInputChange"] = (
    _event,
    value,
    reason
  ) => {
    if (mode !== "remote") {
      return;
    }

    if (reason === "input") {
      setSearchKeyword(value);
      return;
    }

    if (reason === "clear") {
      setSearchKeyword("");
    }
  };

  const handleBlur = (
    event?: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nextValue = idField
      ? selectedOption?.[idField] ?? null
      : selectedOption;

    const registerOnBlur = onBlur as
      | ((event: {
          target: {
            name?: string;
            value: any;
          };
          type?: string;
        }) => void)
      | undefined;

    if (name) {
      registerOnBlur?.({
        target: {
          name,
          value: nextValue,
        },
        type: "blur",
      });

      return;
    }

    const muiOnBlur = onBlur as
      | MuiAutocompleteProps<any, false, boolean, any>["onBlur"]
      | undefined;

    muiOnBlur?.(event as any);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }

    const externalOnKeyDown = (muiProps as any).onKeyDown as
      | ((event: KeyboardEvent<HTMLDivElement>) => void)
      | undefined;

    externalOnKeyDown?.(event);
  };

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const listboxNode = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = listboxNode;

    const isBottom = scrollTop + clientHeight >= scrollHeight - 5;

    if (isBottom && !loading) {
      loadNextPage();
    }
  };

  const getOptionLabel = (option: any) => {
    if (!option) return "";

    if (typeof option === "string") {
      return option;
    }

    return String(option?.[optionTextField] ?? "");
  };

  const isOptionEqualToValue = (option: any, value: any) => {
    if (!option || !value) return false;

    return option?.[optionIdField] === value?.[optionIdField];
  };

  const externalSlotProps = (muiProps as any).slotProps;
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

  return (
    <MuiAutocomplete
      {...muiProps}
      sx={{
        ...styles.autocomplete,
        ...muiProps.sx,
      }}
      options={mergedOptions()}
      value={selectedOption}
      loading={loading || Boolean((muiProps as any).loading)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      noOptionsText={t("text.no_options")}
      autoHighlight
      selectOnFocus
      onKeyDown={handleKeyDown}
      clearOnBlur
      clearIcon={<Icons name={IconName.CLOSE} size={20} />}
      filterOptions={
        mode === "remote"
          ? (items) => items
          : (muiProps as any).filterOptions
      }
      slotProps={mergedSlotProps}
      renderInput={(inputParams) => (
        <TextField
          {...inputParams}
          inputRef={setInputRef}
          required={required}
          label={label}
          error={error}
          helperText={helperText}
          onBlur={handleBlur}
        />
      )}
    />
  );
});