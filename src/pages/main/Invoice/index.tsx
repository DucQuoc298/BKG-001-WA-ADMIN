import { useGridApiRef } from '@mui/x-data-grid-pro';
import { ContainerWrapper, MainCard, DataTable } from 'components';
import React, { useCallback, useMemo } from 'react';
import { EGridColTypes, IGridColDef } from 'types/grid';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

type Product = {
  id: number;
  title: string;
  brand?: string;
};

const columnsDefinition: IGridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'brand', headerName: 'Brand', width: 130, flex: 1 },
  { field: 'price', headerName: 'Price', width: 130, flex: 1, type: EGridColTypes.ABS_NUMBER },
  { field: 'sell', headerName: 'Sell', width: 130, flex: 1, type: EGridColTypes.DATETIME },
];

export default function Invoice() {
  const apiGridRef = useGridApiRef();

  const productStore = useMemo(() => ({
    cacheKey: 'invoice-products',
    mode: 'remote' as const,
    params: { keyword: 'phone' },
    fnGetData: (
      params: { keyword: string; page: number; pageSize: number },
      onSuccess?: (data: Product[], total?: number) => void
    ) => {
      const { keyword, page, pageSize } = params;
      if (!keyword || !keyword.trim()) {
        onSuccess?.([]);
        return;
      }

      fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(
          keyword
        )}&limit=${pageSize}&skip=${page * pageSize}`
      )
        .then((res) => res.json())
        .then((data) => {
          onSuccess?.(data.products ?? [], data.total ?? 0);
        })
        .catch(() => {
          onSuccess?.([]);
        });
    }
  }), []);

  // Cấu hình các nút Action
  const actionItems = useMemo(() => [
    { key: 'edit', label: 'Edit', icon: 'Edit' },
    { key: 'delete', label: 'Delete', icon: 'Delete' }
  ], []);

  const handleActionClick = useCallback((actionKey: any, row: any) => {
    if (actionKey === 'edit') {
      console.log('Edit item:', row);
    } else if (actionKey === 'delete') {
      console.log('Delete item:', row);
    }
  }, []);

  return (
    <ContainerWrapper
      toolbarLocalProps={{
        title: 'Invoice',
      }}
    >
      <MainCard>
        <DataTable
          apiRef={apiGridRef}
          variant="view"
          columns={columnsDefinition}
          store={productStore}
          actionBars={actionItems as any}
          handleActionClick={handleActionClick}
          checkboxSelection
        />
      </MainCard>
    </ContainerWrapper>
  );
}
