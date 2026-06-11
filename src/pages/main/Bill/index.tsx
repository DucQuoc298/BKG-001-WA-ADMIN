import { Button, ContainerWrapper, MainCard, Tabs } from 'components';
import { useBill } from 'hooks/useBill';
import React, { useCallback } from 'react';
import { IAction, IActionAndSub, EFormMode, ITab } from 'types';
import { GridActive, GridAll } from './Grids';
import GridArchive from './Grids/Archive';
import { IconName } from 'assets/Icon';
enum EKeyTab {
  All = "all",
  ACTIVE = "active",
  ARCHIVE = "archive",
}

export default function Bill() {
  const {
    listState,
    formState,
    updateTab,
    openForm
  } = useBill()

  const { activeTab } = listState;
  const { mode } = formState;
  const handleTabChange = (newValue: EKeyTab) => {
    updateTab(newValue);
  }

  const tabsList: ITab[] = [
    { key: EKeyTab.All, label: "All" },
    { key: EKeyTab.ACTIVE, label: "Active", count: 130 },
    { key: EKeyTab.ARCHIVE, label: "Archive", count: 4 },
  ];

  const handleActionClick = useCallback((actionKey: IAction | IActionAndSub) => {
    if (actionKey === IAction.NEW) {
      openForm(EFormMode.FORM);
    }
  }, [openForm])
  return (
    <ContainerWrapper
      toolbarLocalProps={{
        title: 'Bill',
        buttons: [
          { key: IAction.NEW, icon: IconName.NEW, label: "New Bill" }
        ],
        handleButtonClick: handleActionClick,
      }}
    >
      {mode === EFormMode.LIST && (<MainCard>
        <Tabs
          tabs={tabsList}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
        {activeTab === EKeyTab.All && (
          <GridAll onButtonClick={handleActionClick} />
        )}
        {activeTab === EKeyTab.ACTIVE && (
          <GridActive />
        )}
        {activeTab === EKeyTab.ARCHIVE && (
          <GridArchive />
        )}
      </MainCard>)}
      {mode === EFormMode.FORM && (
        <MainCard>
          <Button text="Back" onClick={() => { openForm(EFormMode.LIST) }} />
        </MainCard>
      )}
    </ContainerWrapper>
  );
}
