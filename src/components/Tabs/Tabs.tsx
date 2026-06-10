import { Tabs as MuiTabs, Tab, SxProps, Typography } from "@mui/material";
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
      onChange={(event, value) => handleTabChange(value)}
      sx={sx}
    >
      {
        tabs.map((tab) => (
          <Tab
            key={tab.key}
            label={<Typography
              sx={{ ...styles.label }}>{tab.label}
              {tab.count && tab.count > 0 ? <Typography sx={styles.count}>{tab.count}</Typography> : null}
            </Typography>}
            value={tab.key}
            sx={{ ...styles.tab }}
          />
        ))
      }

    </MuiTabs >
  )
}

export default memo(Tabs);