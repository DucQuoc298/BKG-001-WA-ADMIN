import React, { memo } from "react";
import { Button as MuiButton, ButtonProps, SxProps, useTheme } from "@mui/material";
import createStyle from "./styles";
import { IThemeMode } from "types";

type IButton = ButtonProps & {
  text?: string;
};

const Button = ({
  text = "",
  variant = "contained",
  sx,
  ...props
}: IButton) => {
  const styles = createStyle();
  const theme = useTheme();
  const sxBtn = (
    {
      ...(props.startIcon || props.endIcon ? styles.buttonIcon : styles.button),
      ...sx,
      ...(variant === "outlined" && { "&:hover": { color: theme.palette.mode === IThemeMode.DARK ? theme.palette.primary.light : theme.palette.primary.main } }),
      ...(variant === "contained" && { color: 'white' }),
      ...(variant === "text" && { "&:hover": { "color": "theme.palette.primary.main" } })
    }
  ) as SxProps;
  return (
    <MuiButton
      {...props}
      disableElevation
      variant={variant}
      sx={sxBtn}
    >
      {text}
    </MuiButton>
  );
};

export default memo(Button);
