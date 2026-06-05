import { Grid, Typography } from '@mui/material';
import { IconName } from 'assets/Icon';
import { ContainerWrapper, MainCard, TextField } from 'components';
import React from 'react';
import { IAction, IActionAndSub } from 'types/commom';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Home() {

  const handleButtonClick = (action: IAction | IActionAndSub) => {
    console.log('Button clicked:', action);
  }

  return (
    <ContainerWrapper
      toolbarLocalProps={{ 
        title: 'Homeasjkbdbajsdjbkabsdabjdsjbk',
        handleButtonClick: handleButtonClick,
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
        Home
      </Typography>
      <TextField label="Search" variant="outlined" fullWidth />
      </MainCard>
    </ContainerWrapper>
  );
}
