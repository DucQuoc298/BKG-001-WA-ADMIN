import React, { memo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Stack, TextField, InputAdornment } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import createStyles from "./styles";
import { debounce } from "utils";
export interface SearchElememt {
  clear: () => void;
}
interface ISearchField {
  // currentProfile?: IUserSearchProfile;
  // profiles?: IUserSearchProfile[];
  value?: string;
  placeHolder?: string;
  onSearchChange: (v?: string) => void;
}

const SearchField = forwardRef<SearchElememt, ISearchField>((props, ref) => {
  const {
    // currentProfile,
    // profiles = [],
    value,
    placeHolder = "Search Field",
    onSearchChange,
    // ...rest
  } = props;
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState<string>(value ?? "");
  const styles = createStyles();
  const handleChange = (v: string) => {
    // setLocalValue(v as string);
    onSearchChange(v);
  };

  const debouncedSearch = debounce(handleChange, 300);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setLocalValue("");
      onSearchChange();
      if (textFieldRef.current)
        (textFieldRef.current as HTMLInputElement).value = "";
    },
  }));
  return (
    <Stack direction={"row"}>
      <TextField
        value={localValue}
        inputRef={textFieldRef}
        sx={styles.searchfield}
        placeholder={placeHolder}
        variant="outlined"
        onChange={(e) => {
          const v = e.target.value;
          setLocalValue(v);
          debouncedSearch(v);
          // handleChange(v);

        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {value && (
                  <Clear
                    sx={{ fontSize: "12px", cursor: "pointer", mr: "6px", mx: "6px" }}
                    onClick={() => {
                      if (textFieldRef.current)
                        (textFieldRef.current as HTMLInputElement).value = "";
                      setLocalValue("");
                      handleChange("");
                    }}
                  />
                )}
              </>
            ),
          }
        }
        }
      />
    </Stack>
  );
});
SearchField.displayName = "SearchField";
export default memo(SearchField);
