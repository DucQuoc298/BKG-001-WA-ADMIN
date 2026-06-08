import { Typography } from '@mui/material';
import { IconName } from 'assets/Icon';
import { ContainerWrapper, MainCard } from 'components';
import React from 'react';
import { IAction } from 'types/commom';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Bill() {

  return (
    <ContainerWrapper
      toolbarLocalProps={{ 
        title: 'Bill',
        
        buttons: [
          { 
            key: IAction.NEW, 
            label: 'Add', 
            icon: IconName.NEW,
            items: [
              { key: IAction.NEW, label: 'Add', icon: IconName.NEW},
            ]
          },
          { key: IAction.EDIT, label: 'Edit', icon: IconName.EDIT },
          { key: IAction.DELETE, label: 'Delete', icon: IconName.DELETE },
          { key: IAction.VIEW, label: 'View', icon: IconName.VIEW },
          { key: IAction.CANCEL, label: 'Cancel', icon: IconName.CANCEL },
          
        ]
      }}
    >
      <MainCard>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Bill
          </Typography>
      </MainCard>
    </ContainerWrapper>
  );
}
