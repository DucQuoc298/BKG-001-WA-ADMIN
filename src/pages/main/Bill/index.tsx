import { Box, Tab, Tabs, Typography } from '@mui/material';
import { IconName } from 'assets/Icon';
import { ContainerWrapper, MainCard } from 'components';
import React from 'react';
import { IAction } from 'types/commom';
import { BillListPage } from './ListPage';
import { InvoiceCreatePage } from './CreateBill';
// ==============================|| DASHBOARD - DEFAULT ||============================== //


export const pageRegistry = {
  billList: BillListPage,
  billCreate: InvoiceCreatePage,
  // billDetail: <Box>billDetail</Box>,
};
type KeepAlivePanelProps = {
  active: boolean;
  children: React.ReactNode;
};

export type PageType = keyof typeof pageRegistry;
export type AppTab = {
  id: string;
  title: string;
  pageType: PageType;
  params?: Record<string, any>;
  closable?: boolean;
};
export function KeepAlivePanel({ active, children }: KeepAlivePanelProps) {
  return (
    <div
      style={{
        display: active ? "block" : "none",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}
type WorkspaceProps = {
  tabs: AppTab[];
  activeTabId: string;
};

export default function Bill() {

  const tabs: AppTab[] = [
    {
      id: "billList",
      title: "Bills",
      pageType: "billList",
    },
    {
      id: "billCreate",
      title: "New Bill",
      pageType: "billCreate",
    },
    // {
    //   id: "billDetail",
    //   title: "Bill INV001",
    //   pageType: "billDetail",
    //   params: {
    //     billId: "INV001",
    //   },
    // },
  ];

  const [activeTabId, setActiveTabId] = React.useState("billList");

  const openTab = React.useCallback((tab: AppTab) => {
    setActiveTabId(tab.id);
    // nếu là view thì mở ra còn không là tabs sẽ ko mở ra
  }, []);

  return (
    <ContainerWrapper
      toolbarLocalProps={{
        title: 'Bill',
      }}
    >
      <MainCard>
        <Tabs
          value={activeTabId}
          onChange={(event, newValue) => {
            setActiveTabId(newValue);
          }}
          variant="scrollable">
          {
            tabs.map((tab) => (
              <Tab key={tab.id} label={tab.title} onClick={() => openTab(tab)} />
            ))
          }
        </Tabs>
        <>

          <KeepAlivePanel active={activeTabId === "billList"}>
            <BillListPage tabId="billList" params={{}} />
          </KeepAlivePanel>
          <KeepAlivePanel active={activeTabId === "billCreate"}>
            <InvoiceCreatePage tabId="billCreate" params={{}} />
          </KeepAlivePanel>
        </>
      </MainCard>
    </ContainerWrapper>
  );
}
