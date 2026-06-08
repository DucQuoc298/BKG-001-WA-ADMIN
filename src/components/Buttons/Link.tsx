import React, { memo } from 'react';
import { Link as MuiLink, SxProps } from '@mui/material';
import type { TypographyVariant } from '@mui/material/styles';

interface LinkProps {
    children?: React.ReactNode;
    sx?: SxProps;
    onClick?: () => void;
    typography?: TypographyVariant;
}

const Link = ({
    children,
    onClick,
    typography,
    sx,
}: LinkProps) => {
    return (<MuiLink
        component="button"
        variant={typography}
        sx={{
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',

            },
            cursor: 'pointer',
            ...sx
        }}
        onClick={onClick}
    >
        {children}
    </MuiLink>);
};

export default memo(Link);