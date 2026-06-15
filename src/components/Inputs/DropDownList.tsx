import { FormControl, FormLabel, MenuItem, Select, SelectProps, IconButton, InputAdornment, Typography, Box, Chip } from "@mui/material";
import inputStyles from "./styles";
import { UseFormRegister } from "react-hook-form";
import { forwardRef, useEffect, useState } from "react";
import Icons, { IconName } from "assets/Icon";

type IValue = {
  id: string;
  text: string;
}

type IDropDownListProps = Omit<SelectProps<string | string[]>, "variant"> &
  ReturnType<UseFormRegister<any>> & {
    label?: string;
    data: IValue[];
    forceSelect?: boolean;
    helperText?: string;
  };

const DropDownList = forwardRef<HTMLDivElement, IDropDownListProps>(function DropDownList({
  label,
  data,
  forceSelect,
  value,
  onChange,
  onBlur,
  ...props
}, ref) {
  const iStyles = inputStyles();
  const [selectedValue, setSelectedValue] = useState(() => {
    if (props.multiple) {
      return Array.isArray(value) ? value : (value ? [value] : []);
    }
    return value ?? "";
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedValue(props.multiple ? (Array.isArray(value) ? value : (value ? [value] : [])) : (value ?? ""));
  }, [value, props.multiple]);

  const handleToggleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const emptyValue = props.multiple ? [] : "";
    setSelectedValue(emptyValue);
    setOpen(false);
    onChange?.({ target: { name: props.name, value: emptyValue }, type: "change" } as any);
  };

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <FormLabel sx={{ ...iStyles.labelDefault }}>
          {label}
          {forceSelect && <Typography sx={{ color: "error.main", height: '100%' }}>*</Typography>}
        </FormLabel>
        <Select
          ref={ref}
          {...props}
          IconComponent={() => null}
          value={selectedValue}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onChange={(event) => {
            setSelectedValue(event.target.value);
            setOpen(false);
            onChange?.(event);
          }}
          sx={{
            ...iStyles.textfield,
            padding: '0px !important',
          }}
          multiple={props.multiple}
          renderValue={(selected) => {
            if (Array.isArray(selected)) {
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const item = data.find((d) => d.id === value);
                    return <Chip key={value} label={item ? item.text : value} />;
                  })}
                </Box>
              );
            }
            const item = data.find((d) => d.id === selected);
            return item ? item.text : selected;
          }}
          onBlur={onBlur}
          endAdornment={
            <InputAdornment position="end">
              {!forceSelect && !!selectedValue ? (
                <IconButton
                  sx={{ ...iStyles.clearButton, marginRight: "4px" }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={handleClear}
                >
                  <Icons name={IconName.CLEAR} size={20} />
                </IconButton>
              ) : null}
              <IconButton
                sx={{ ...iStyles.clearButton }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={handleToggleOpen}
              >
                <Icons name={open ? IconName.DROPUP : IconName.DROPDOWN} size={18} />
              </IconButton>
            </InputAdornment>
          }
        >
          {data.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
})

export default DropDownList;