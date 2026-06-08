import { Grid, Typography } from '@mui/material';
import { IconName } from 'assets/Icon';
import { ContainerWrapper, MainCard, TextField, DataTable } from 'components';
import React from 'react';
import { IAction, IActionAndSub } from 'types/commom';
import {useForm} from 'hooks/useForm';
import { IGridColDef } from 'types/grid';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const invoiceDummyColumns: IGridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'customerName', headerName: 'Customer', flex: 1, minWidth: 180, editable: true },
  { field: 'invoiceNo', headerName: 'Invoice No', width: 150, editable: true },
  { field: 'amount', headerName: 'Amount', width: 140, type: 'number', editable: true },
  { field: 'createdDate', headerName: 'Created Date', width: 140, customType: 'date', editable: true }
];

const invoiceDummyRows = [
  { id: 1, customerName: 'Nguyen Van An', invoiceNo: 'INV-2026-001', amount: 1250000, createdDate: '2026-01-01T00:00:00+00:00' },
  { id: 2, customerName: 'Tran Thi Binh', invoiceNo: 'INV-2026-002', amount: 2890000, createdDate: '2026-01-02T00:00:00+00:00' },
  { id: 3, customerName: 'Le Hoang Duc', invoiceNo: 'INV-2026-003', amount: 790000, createdDate: '2026-01-03T00:00:00+00:00' },
  { id: 4, customerName: 'Pham Gia Huy', invoiceNo: 'INV-2026-004', amount: 4300000, createdDate: '2026-01-04T00:00:00+00:00' },
  { id: 5, customerName: 'Do Minh Khoa', invoiceNo: 'INV-2026-005', amount: 1560000, createdDate: '2026-01-05T00:00:00+00:00' }
];

export default function Invoice() {
  const handleButtonClick = (action: IAction | IActionAndSub) => {
    console.log('Button Invoice clicked:', action);
  }
  const { invoiceForm, update, reset } = useForm();
 const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {  value } = e.target;

      update("invoiceForm",{
        customerName: value,
      })
  };

  console.log('Invoice Form:', invoiceForm);

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
      {/* <MainCard>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Invoice
      </Typography>
      <TextField label="Search" variant="outlined" value={invoiceForm.customerName} fullWidth onChange={handleChange} />
      </MainCard> */}

      <MainCard>
        <DataTable variant="view" columns={invoiceDummyColumns} rows={invoiceDummyRows} />
      </MainCard>
      <MainCard sx={{ mt: 2 }}>
        <DataTable variant="edit" columns={invoiceDummyColumns} rows={invoiceDummyRows} />
      </MainCard>
    </ContainerWrapper>
  );
}
