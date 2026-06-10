import { Box, Typography } from '@mui/material';
import { ContainerWrapper, MainCard, Tabs } from 'components';
import { useBill } from 'hooks/useBill';
import React from 'react';
import { ITab } from 'types';

enum EKeyTab {
  All = "all",
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export default function Bill() {
  const {
    listState,
    updateTab,
  } = useBill()

  const { activeTab } = listState;
  const handleTabChange = (newValue: EKeyTab) => {
    updateTab(newValue);
  }

  const tabsList: ITab[] = [
    { key: EKeyTab.All, label: "All" },
    { key: EKeyTab.ACTIVE, label: "Active", count: 130 },
    { key: EKeyTab.INACTIVE, label: "Inactive", count: 4 },
  ];
  return (
    <ContainerWrapper
      toolbarLocalProps={{
        title: 'Bill',
      }}
    >
      <MainCard>
        <Tabs
          tabs={tabsList}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
        {activeTab === EKeyTab.All && (
          <Box>
            <Typography variant="h6">All</Typography>
          </Box>
        )}
        {activeTab === EKeyTab.ACTIVE && (
          <Box>
            <Typography variant="h6">Active</Typography>
          </Box>
        )}
        {activeTab === EKeyTab.INACTIVE && (
          <Box>
            <Typography variant="h6">Inactive</Typography>
          </Box>
        )}
      </MainCard>
    </ContainerWrapper>
  );
}
