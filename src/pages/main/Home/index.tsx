import { Typography } from '@mui/material';
import { IconName } from 'assets/Icon';
import { Button, ContainerWrapper, MainCard, TextField } from 'components';
import React from 'react';
import { IAction, IActionAndSub, IFormMode } from 'types/commom';
import {useHome} from 'hooks';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Home() {
  const handleButtonClick = (action: IAction | IActionAndSub) => {
    console.log('Button Home clicked:', action);
  }
  const { homeForm, update } = useHome();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {  value } = e.target;

      update({
        note: value,
      })
  };
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
        Home {homeForm.formMode === IFormMode.VIEW ? 'View Mode' : homeForm.formMode === IFormMode.FORM ? 'Edit Mode' : 'New Mode'}
      </Typography>
      <Button variant='contained' text="Open Form" onClick={() => update({ formMode: homeForm.formMode === IFormMode.FORM ? IFormMode.VIEW : IFormMode.FORM })} />
      {homeForm.formMode === IFormMode.FORM && (
        <TextField label="Search" variant="outlined" value={homeForm.note} fullWidth onChange={handleChange} />
      )}
      </MainCard>
    </ContainerWrapper>
  );
}
