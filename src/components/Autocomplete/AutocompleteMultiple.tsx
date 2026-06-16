import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
// Component
// ---------------------------------------------------------------------------

export const AutocompleteMultiple = forwardRef<HTMLInputElement, AutocompleteProps>(
  function AutocompleteMultiple(props, ref) {
    const {
      store,
      label,
      idField = "id",
      textField = "text",
      error,
      helperText,
      required,
      name,
      value: valueProp,        // controlled value from Redux / react-hook-form
      defaultValue,            
      onChange,
      onBlur,
      ...rest
    } = props;

    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchKeyword, setSearchKeyword] = useState("");

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
        keyword: searchKeyword.trim().length > 0 ? searchKeyword : storeParams?.keyword,
      };
    }, [mode, storeParams, searchKeyword]);

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
      if (valueProp !== undefined) return valueProp ?? [];
      if (defaultValue !== undefined) return defaultValue ?? [];
      return [];
    };

    const [selectedOption, setSelectedOption] = useState<any>(resolveInitial);

    /**
     * Sync when the parent-controlled value changes (e.g. Redux store hydrated
     * after remount, or form reset).
     */
    useEffect(() => {
      if (valueProp !== undefined) {
        setSelectedOption(Array.isArray(valueProp) ? valueProp : []);
      }
    }, [valueProp]);

    const safeSelectedOption = Array.isArray(selectedOption) ? selectedOption : [];

    const handleScroll = useCallback(
      (event: UIEvent<HTMLElement>) => {
        const el = event.currentTarget;
        const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
        if (isBottom && !loading) loadNextPage();
      },
      [loading, loadNextPage],
    );

    const handleChange: MuiAutocompleteProps<any, true, boolean, any>["onChange"] =
      useCallback(
        (event, newValue, reason, details) => {
          const nextValue = newValue ?? [];
          setSelectedOption(nextValue);

          if (name) {
            (onChange as ((event: { target: { name?: string; value: any[] }; type?: string }) => void) | undefined)?.({
              target: {
                name,
                value: nextValue,
              },
              type: "change",
            });
            return;
          }

          onChange?.({
            target: {
              name,
              value: nextValue,
            },
            type: "change",
          } as any, nextValue, reason, details);
          },
        [name, onChange],
      );

    const handleInputChange: MuiAutocompleteProps<
      any,
      true,
      boolean,
      any
    >["onInputChange"] = useCallback(
      (_event, value, reason) => {
        if (mode !== "remote") return;

        if (reason === "input") {
          setSearchKeyword(value);
          return;
        }

        if (reason === "clear") {
          setSearchKeyword("");
        }
      },
      [mode],
    );

    const handleBlur: MuiAutocompleteProps<any, true, boolean, any>["onBlur"] = (event) => {
      if (name) {
        (onBlur as ((event: { target: { name?: string; value: any[] }; type?: string }) => void) | undefined)?.({
          target: {
            name,
            value: safeSelectedOption,
          },
          type: "blur",
        });
        return;
      }

      (onBlur as MuiAutocompleteProps<any, true, boolean, any>["onBlur"] | undefined)?.(event as any);
    };

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
        {...(rest as any)}
        ref={ref}
        sx={{ ...styles.autocomplete, ...rest.sx }}
        slotProps={mergedSlotProps}
        // Controlled value
        value={safeSelectedOption}
        multiple
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
        onBlur={handleBlur}
        // Labels
        noOptionsText={t("text.no_options")}
        getOptionLabel={(option) => {
          const currentOption = option as any;
          return typeof currentOption === "string" ? currentOption : (currentOption?.[optionTextField] ?? "");
        }
        }
        isOptionEqualToValue={(option, val) => {
          const currentOption = option as any;
          const currentValue = val as any;
          return currentOption?.[optionIdField] === currentValue?.[optionIdField];
        }
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