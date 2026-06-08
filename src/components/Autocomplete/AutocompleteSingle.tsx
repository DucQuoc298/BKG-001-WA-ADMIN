import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type UIEvent,
} from "react";
import {
  Autocomplete as MuiAutocomplete,
  type AutocompleteProps as MuiAutocompleteProps,
} from "@mui/material";
import { AutocompleteProps } from ".";
import styles from "./styles";
import { TextField } from "components";
import { useAutocomplete } from "hooks";
import Icons, { IconName } from "assets/Icon";
import { useTranslation } from "react-i18next";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Stable debounce — created once, not re-created on every render */
function createDebounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AutocompleteSingle = forwardRef<HTMLInputElement, AutocompleteProps>(
  function AutocompleteSingle(props, ref) {
    const {
      store,
      label,
      idField = "id",
      textField = "text",
      error,
      helperText,
      required,
      forceSelection,
      name,
      value: valueProp,        // controlled value from Redux / react-hook-form
      defaultValue,            
      onChange,
      onBlur,
      ...rest
    } = props;

    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [, startTransition] = useTransition();

    const {
      data,
      params: storeParams,
      fnGetData,
      mode = "local",
    } = store;

    const optionIdField = idField || "id";
    const optionTextField = textField || "text";
    const pageSize = 7;

    // ------------------------------------------------------------------
    // Build params for useAutocomplete
    // ------------------------------------------------------------------
    const effectiveParams = useMemo(() => {
      if (mode !== "remote") return storeParams;
      return {
        ...(storeParams ?? {}),
        page: 0,
        keyword: storeParams?.keyword,
      };
    }, [mode, storeParams]);

    const cacheKey =
      (store as any).cacheKey ||
      `${name || label || "autocomplete"}:${optionIdField}:${optionTextField}`;

    const { options, loading, loadNextPage } = useAutocomplete<any>({
      cacheKey,
      mode,
      data,
      params: effectiveParams,
      fnGetData,
      pageSize,
    });


    const resolveInitial = () => {
      if (valueProp !== undefined) return valueProp ?? null;
      if (defaultValue !== undefined) return defaultValue ?? null;
      return null;
    };

    const [selectedOption, setSelectedOption] = useState<any>(resolveInitial);

    /**
     * Sync when the parent-controlled value changes (e.g. Redux store hydrated
     * after remount, or form reset).
     */
    useEffect(() => {
      if (valueProp !== undefined) {
        setSelectedOption(valueProp ?? null);
      }
    }, [valueProp]);

    // ------------------------------------------------------------------
    // Scroll → load next page
    // ------------------------------------------------------------------
    const handleScroll = useCallback(
      (event: UIEvent<HTMLElement>) => {
        const el = event.currentTarget;
        const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
        if (isBottom && !loading) loadNextPage();
      },
      [loading, loadNextPage],
    );

    // ------------------------------------------------------------------
    // onChange — propagate to parent (Redux dispatch / react-hook-form)
    // ------------------------------------------------------------------
    const handleChange: MuiAutocompleteProps<any, false, boolean, any>["onChange"] =
      useCallback(
        (_event, newValue, reason) => {
          // forceSelection: clear if user typed something not in list
          if (forceSelection && reason === "blur" && typeof newValue === "string") {
            setSelectedOption(null);
            onChange?.(null as any, null, reason, undefined);
            return;
          }

          setSelectedOption(newValue ?? null);
          onChange?.({
            target: {
                name,
                value: newValue,
              },
            type: "change",
            } as any, newValue, reason);
          },
        [forceSelection, onChange],
      );

    // ------------------------------------------------------------------
    // Remote keyword search with debounce
    // ------------------------------------------------------------------
    const remoteSearch = useCallback(
      (keyword: string) => {
        if (mode !== "remote" || !fnGetData) return;

        startTransition(() => {
          const filter: any[] = [];
          if (storeParams?.filter) filter.push(storeParams.filter);
          if (keyword) filter.push({ property: textField, value: keyword, method: "like" });

          fnGetData({ ...storeParams, filter, page: 0, pageSize }, () => {
            // useAutocomplete handles state update via its own listener
          });
        });
      },
      [mode, fnGetData, storeParams, textField, pageSize],
    );

    // Stable debounced version — recreated only when remoteSearch identity changes
    const debouncedSearch = useMemo(
      () => createDebounce(remoteSearch, 700),
      [remoteSearch],
    );

    const handleInputChange: MuiAutocompleteProps<
      any,
      false,
      boolean,
      any
    >["onInputChange"] = useCallback(
      (_event, value, reason) => {
        // Only trigger API call for actual user typing, not programmatic changes
        if (reason === "input") {
          debouncedSearch(value);
        }
      },
      [debouncedSearch],
    );

    // ------------------------------------------------------------------
    // Slot props — merge external listbox props with scroll handler
    // ------------------------------------------------------------------
    const externalSlotProps = (rest as any).slotProps ?? {};
    const externalListbox = externalSlotProps.listbox ?? {};

    const mergedSlotProps = useMemo(
      () => ({
        ...externalSlotProps,
        listbox: {
          ...externalListbox,
          style: {
            maxHeight: "200px",
            overflow: "auto",
            ...externalListbox.style,
          },
          onScroll: (event: UIEvent<HTMLElement>) => {
            externalListbox.onScroll?.(event);
            handleScroll(event);
          },
        },
      }),
      [externalSlotProps, externalListbox, handleScroll],
    );

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    return (
      <MuiAutocomplete
        {...rest}
        ref={ref}
        sx={{ ...styles.autocomplete, ...rest.sx }}
        slotProps={mergedSlotProps}
        // Controlled value
        value={selectedOption}
        // Options
        options={options}
        loading={loading}
        // Behaviour
        autoHighlight
        selectOnFocus
        clearOnBlur
        // Handlers
        onChange={handleChange}
        onInputChange={handleInputChange}
        onBlur={onBlur as any}
        // Labels
        noOptionsText={t("text.no_options")}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : (option[optionTextField] ?? "")
        }
        isOptionEqualToValue={(option, val) =>
          option[optionIdField] === val?.[optionIdField]
        }
        clearIcon={<Icons name={IconName.CLOSE} size={14} />}
        renderInput={(inputParams) => (
          <TextField
            {...inputParams}
            ref={inputRef}
            required={required}
            label={label}
            error={error}
            helperText={helperText}
            name={name}
          />
        )}
      />
    );
  },
);