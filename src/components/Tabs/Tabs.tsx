import { Tabs as MuiTabs, Tab, SxProps, Typography, Box, Badge } from "@mui/material";
import React, { memo } from "react";
import styles from "./styles";
import { ITab } from "types";

interface ITabs {
  activeTab: string;
  tabs: ITab[];
  renderSearch?: React.ReactNode;
  handleTabChange: (newValue: any) => void;
  sx?: SxProps;
  containerSx?: SxProps;
}
const Tabs = ({
  activeTab,
  tabs,
  handleTabChange,
  sx
}: ITabs) => {
  return (
    <MuiTabs
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      value={activeTab}
      onChange={(event, value) => {
        event.preventDefault();
        event.stopPropagation();
        handleTabChange(value);
      }}
      sx={[styles.tabs, sx] as SxProps}
    >
      {
        tabs.map((tab) => (
          <Tab
            key={tab.key}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ ...styles.label }}>{tab.label}</Typography>
                {tab.count && tab.count > 0 ? (
                  <Badge
                    badgeContent={tab.count}
                    max={99999}
                    sx={{
                      '& .MuiBadge-badge': {
                        position: 'static',
                        transform: 'none',
                        backgroundColor: '#E5E7EB',
                        color: '#374151',
                        border: 'none',
                        height: '20px',
                        minWidth: '20px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        lineHeight: '20px',
                      },
                    }}
                  />
                ) : null}
              </Box>
            }
            value={tab.key}
            sx={{ ...styles.tab }}
          />
        ))
      }

    </MuiTabs >
  )
}

export default memo(Tabs);