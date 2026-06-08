import { memo } from 'react';
import DataTableView from './DataTableView';
import DataTableForm from './DataTableForm';
import { IGridColDef } from 'types/grid';

interface DataTableProps {
  variant: 'view' | 'edit';
  columns?: IGridColDef[];
  rows?: any[];
}

const DataTable = ({ variant, columns = [], rows = [] }: DataTableProps) => {
  return variant === 'view'
    ? <DataTableView columns={columns} rows={rows} />
    : <DataTableForm columns={columns} rows={rows} />;
}
export default memo(DataTable);