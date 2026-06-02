import React, { memo } from "react"
import { ToggleButtonGroup as MuiToggleButtonGroup, SxProps, ToggleButton, useTheme } from "@mui/material"
import { useTranslation } from "react-i18next";
// import createStyle from "./styles";

interface IToggleButtonGroup {
  value: string;
  handleChange: (
    _e: React.MouseEvent<HTMLElement>,
    newValue: string,) => void;
  data: string[];
  formKey: string;
  groupSx?: SxProps;
  buttonSx?: SxProps;
}

const ToggleButtonGroup = ({
  value,
  handleChange,
  data,
  formKey,
  groupSx,
  buttonSx
}: IToggleButtonGroup) => {
  const { t } = useTranslation()
  // const styles = createStyle()
  const { palette } = useTheme();

  return (
    <MuiToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      sx={{
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 1,
        '& .MuiToggleButton-root': {
          border: `1px solid ${palette.divider}`,
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: palette.grey[50]
          }, 
          '&.Mui-selected': {
            backgroundColor: palette.grey[100],
            '&:hover': {
              backgroundColor: palette.grey[50]
            }
          }
        },
        ...(groupSx as object ?? {})
      }}
  >
      {data.map((item) => (
        <ToggleButton key={item}
            value={item} aria-label="centered"
            sx={{ 
              textTransform: 'none', 
              width: { xs: '100%', sm: 'auto' }, 
              fontWeight: 'bold',
              minWidth: 120,
              ...buttonSx 
            }}
        >
            {t(`${formKey}.${item}`)}
        </ToggleButton>
      ))}
  </MuiToggleButtonGroup>
  )
}

export default memo(ToggleButtonGroup)