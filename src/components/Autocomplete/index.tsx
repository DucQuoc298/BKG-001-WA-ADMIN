import  { AutocompleteProps as MuiAutocompleteProps } from "@mui/material";
import { forwardRef } from "react";
import { AutocompleteSingle } from "./AutocompleteSingle";
import { AutocompleteMultiple } from "./AutocompleteMultiple";
export type AutocompleteProps = Omit<
  MuiAutocompleteProps<any, false, boolean, any>,
  "options" | "renderInput" | "onChange" | "onBlur"
> & {
    label?: string;
    idField?: string;
    textField?: string;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    store: {
      data?: any[];
      params?: any;
      fnGetData?: (params: any, onSuccess?: (data: any[]) => void) => void;
      fnGetDefaultData?:
        | ((value: any, onSuccess?: (data: any[] | any) => void) => void)
        | ((value: any, params: any, onSuccess?: (data: any[] | any) => void) => void);
      buildDefaultParams?: (value: any, params: any) => any;
      mode?: "local" | "remote";
      cacheKey?: string;
    };
    inputRef?: React.Ref<any>;
    forceSelection?: boolean;
    name?: string;
    onChange?:
      | MuiAutocompleteProps<any, false, boolean, any>["onChange"]
      | ((event: { target: { name?: string; value: any }; type?: string }) => void);
    onBlur?:
      | MuiAutocompleteProps<any, false, boolean, any>["onBlur"]
      | ((event: { target: { name?: string; value: any }; type?: string }) => void);
    // handleAddTab?: (newTab: { key: string; text: string }) => void;
  };
export const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps>(
  function Autocomplete({multiple, ...props}, ref) {
    
    
    // For demonstration, we'll just render the label and a simple input
    return (
      multiple ?
      <AutocompleteMultiple  ref={ref} {...(props as any)}/> :
      <AutocompleteSingle  ref={ref} {...(props as any)}/>
    );
  }
);  

export default Autocomplete;