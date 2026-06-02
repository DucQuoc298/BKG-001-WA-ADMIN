import React, { memo } from "react";
import { Link as MuiLink, SxProps } from "@mui/material";

interface LinkProps {
    children?: React.ReactNode;
    sx?: SxProps;
    onClick?: () => void;
    typography?: string;
}
const Link = ({
    children,
    onClick,
    typography,
    sx,
}: LinkProps) => {
    return (<MuiLink
        typography={typography}
        sx={{
            textDecoration: "none",
            "& :hover": {
                textDecoration: "underline",

            },
            cursor: "pointer",
            ...sx
        }}
        onClick={onClick}
    >
        {children}
    </MuiLink>)
};

export default memo(Link);