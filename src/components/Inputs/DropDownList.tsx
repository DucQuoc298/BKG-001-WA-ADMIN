import { FormControl, FormLabel, MenuItem, Select, SelectProps, IconButton, InputAdornment, FormHelperText, Typography } from "@mui/material";
import inputStyles from "./styles";
import { UseFormRegister } from "react-hook-form";
import { forwardRef, useEffect, useState } from "react";
import Icons, { IconName } from "assets/Icon";

type IValue = {
  id: string;
  text: string;
}

type IDropDownListProps = Omit<SelectProps<string>, "variant"> &
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
  const [selectedValue, setSelectedValue] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedValue(value)
  }, [value]);

  const handleToggleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedValue("");
    setOpen(false);
    onChange?.({ target: { name: props.name, value: "" }, type: "change" } as any);
  };

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <FormLabel sx={{...iStyles.labelDefault}}>
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
          onBlur={onBlur}
          endAdornment={
            <InputAdornment position="end">
              {!forceSelect && !!selectedValue ? (
                <IconButton
                  sx={{...iStyles.clearButton, marginRight: "4px"}}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={handleClear}
                >
                  <Icons name={IconName.CLEAR} size={20} />
                </IconButton>
              ) : null}
              <IconButton
                sx={{...iStyles.clearButton}}
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