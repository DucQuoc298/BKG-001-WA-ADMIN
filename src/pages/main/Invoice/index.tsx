import { Typography } from '@mui/material';
import { IconName } from 'assets/Icon';
import { ContainerWrapper, MainCard, TextField } from 'components';
import React from 'react';
import { IAction, IActionAndSub } from 'types/commom';
import {useInvoice} from 'hooks';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Invoice() {
  const handleButtonClick = (action: IAction | IActionAndSub) => {
    console.log('Button Invoice clicked:', action);
  }
  const { invoiceForm, update } = useInvoice();
 const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {  value } = e.target;

      update({
        customerName: value,
      })
  };

  return (
    <ContainerWrapper
      toolbarLocalProps={{ 
        title: 'Invoiceasjkbdbajsdjbkabsdabjdsjbk',
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
        Invoice
      </Typography>
      <TextField label="Search" variant="outlined" value={invoiceForm.customerName} fullWidth onChange={handleChange} />
      </MainCard>
    </ContainerWrapper>
  );
}
