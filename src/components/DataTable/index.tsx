import { forwardRef, memo } from 'react';
import DataTableView from './DataTableView';
import { IGridColDef } from 'types/components/grid';
import { DataGridProProps, GridCallbackDetails, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid-pro';
import { IconName } from 'assets/Icon';
import { DataTableMode, IAction, DataTableVariant } from 'types';
import DataTableForm from './DataTableForm';

export interface ITableAction {
  key: IAction;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

export interface IDataTableStore {
  data?: any[];
  params?: any;
  fnGetData?: (params: any, onSuccess?: (data: any[], total?: number) => void) => void;
  mode?: DataTableMode
  cacheKey?: string;
}

export type DataTableProps = Omit<DataGridProProps, 'columns'> & {
  variant?: DataTableVariant;
  height?: number;
  columns: IGridColDef[];
  handlePagination?: (data: GridPaginationModel) => void;
  handleRowSelectionModelChange?: (params: GridRowSelectionModel, details: GridCallbackDetails<any>) => void;
  actionBars?: ITableAction[];
  handleActionClick?: (key: IAction, row: any) => void;
  store?: IDataTableStore;
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
  return variant === DataTableVariant.VIEW
    ? <DataTableView {...props} apiRef={ref as any} />
    : <DataTableForm {...props} apiRef={ref as any} />;
});

DataTable.displayName = 'DataTable';

export default memo(DataTable);