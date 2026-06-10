import { useState } from "react";
import { DataGrid, GridPaginationModel, GridSortModel, GridFilterModel } from "@mui/x-data-grid";

type BillListPageProps = {
  tabId: string;
  params?: Record<string, any>;
};

export function BillListPage({ tabId }: BillListPageProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  return (
    <DataGrid
      rows={rows}
      columns={[
        { field: "invoiceNo", headerName: "Invoice No", width: 180 },
        { field: "customerName", headerName: "Customer", width: 220 },
        { field: "amount", headerName: "Amount", width: 150 },
      ]}
      loading={loading}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      filterModel={filterModel}
      onFilterModelChange={setFilterModel}
      pageSizeOptions={[25, 50, 100]}
    />
  );
}