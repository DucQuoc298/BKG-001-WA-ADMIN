import { Grid, SxProps } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMemo } from 'react';
import useStyles from './styles';

const dummyColumns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
  { field: 'role', headerName: 'Role', width: 140 },
  { field: 'status', headerName: 'Status', width: 120 }
];

const dummyRows = [
  { id: 1, name: 'Nguyen Van An', email: 'an.nguyen@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Tran Thi Binh', email: 'binh.tran@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Le Hoang Duc', email: 'duc.le@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Pham Gia Huy', email: 'huy.pham@example.com', role: 'Editor', status: 'Pending' },
  { id: 5, name: 'Do Minh Khoa', email: 'khoa.do@example.com', role: 'Viewer', status: 'Active' }
];


interface DataTableViewProps {
  columns: any[];
  rows: any[];
}

const DataTableView = ({ columns, rows }: DataTableViewProps) => {
  const displayColumns = columns?.length ? columns : dummyColumns;
  const displayRows = rows?.length ? rows : dummyRows;
  const styles = useStyles();


  const dataGridStyles = useMemo(() => [
    styles.dataTableView,
    rows.length === 0
        ? {
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "hidden !important",
          },
        }
        : {},
  ], [rows]) as SxProps;

  return (
    <Grid container size={12}>
      <DataGridPro 
        columns={displayColumns}
        rows={displayRows}
        hideFooter={true}
        sx={dataGridStyles}
        disableColumnMenu
        headerFilters={false}
        rowHeight={40}
        isCellEditable={() => false}
      />
    </Grid>
  )
}

export default DataTableView;