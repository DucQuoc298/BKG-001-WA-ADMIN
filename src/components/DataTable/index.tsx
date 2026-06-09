import { forwardRef, memo } from 'react';
import DataTableView from './DataTableView';
import { IGridColDef } from 'types/grid';
import { DataGridProProps, GridCallbackDetails, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid-pro';
import { IconName } from 'assets/Icon';
import { IAction } from 'types';

export interface ITableAction {
  key: IAction;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

export type DataTableProps = Omit<DataGridProProps, 'columns'> & {
  variant?: 'view' | 'edit';
  height?: number;
  columns: IGridColDef[];
  handlePagination?: (data: GridPaginationModel) => void;
  handleRowSelectionModelChange?: (params: GridRowSelectionModel, details: GridCallbackDetails<any>) => void;
  actionBars?: ITableAction[];
  handleActionClick?: (key: IAction, row: any) => void;
  // Bổ sung các props đặc thù của DataTableForm nếu cần
  useI18n?: boolean;
  autoRowHeight?: boolean;
  readOnlyCells?: {
    row: any;
    field?: string;
  }[];
  tableId?: string;
  onGridEditing?: (isEditing: boolean) => void;
}

const DataTable = forwardRef<any, DataTableProps>(({ variant, ...props }, ref) => {
  return variant === 'view'
    ? <DataTableView {...props} apiRef={ref as any} /> : null
  // : <DataTableForm {...props} apiRef={ref as any} />;
});

DataTable.displayName = 'DataTable';

export default memo(DataTable);