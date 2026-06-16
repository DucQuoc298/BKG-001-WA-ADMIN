/** @format */

import React, { forwardRef, JSX } from "react";
import { SvgIconProps } from "@mui/material";

export type ISvgIcon = Omit<SvgIconProps, "color"> & {
  children?: JSX.Element | JSX.Element[];
  color?: string;
};

const SvgIcon = forwardRef<HTMLDivElement, ISvgIcon>(function Icon(
  { children, color = "white", ...props } // ref
) {
  const { width, height, viewBox } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      fill={color}>
      {children}
    </svg>
  );
});

export default SvgIcon;
