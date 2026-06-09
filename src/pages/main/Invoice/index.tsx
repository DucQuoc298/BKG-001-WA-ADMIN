import { useGridApiRef } from '@mui/x-data-grid-pro';
import { ContainerWrapper, MainCard, DataTable } from 'components';
import React, { useCallback, useMemo, useState } from 'react';
import { EGridColTypes, IGridColDef } from 'types/grid';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

type Product = {
  id: number;
  title: string;
  brand?: string;
};

import { IconName } from 'assets/Icon';
import { IAction, IActionAndSub } from 'types';

const columnsDefinition: IGridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'brand', headerName: 'Brand', width: 130, flex: 1 },
  { field: 'price', headerName: 'Price', width: 130, flex: 1, type: EGridColTypes.ABS_NUMBER },
  { field: 'sell', headerName: 'Sell', width: 130, flex: 1, type: EGridColTypes.DATETIME },
];

const mockRows = [
  {
    id: 1,
    title: 'Product 1',
    brand: 'Brand 1',
    price: 2000,
    sell: '2022-01-01',
  },
  {
    id: 2,
    title: 'Product 2',
    price: -1000,
    brand: 'Brand 2',
    sell: '2022-01-01',
  },
];

export default function Invoice() {
  const [, setLoading] = useState(false);
  const [rows, setRows] = useState<Product[]>(mockRows);
  const apiGridRef = useGridApiRef();

  const fetchProducts = useCallback(async ({ keyword, page }: {
    keyword: string;
    page: number;
    isReset?: boolean;
  }, onSuccess?: (data: Product[]) => void) => {
    if (!keyword.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(
          keyword
        )}&limit=14&skip=${page * 14}`
      );

      const data = await res.json();

      const newProducts: Product[] = data.products ?? [];

      if (onSuccess) {
        onSuccess(newProducts);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePagination = useCallback((paginationModel: any) => {
    fetchProducts({ keyword: 'phone', page: paginationModel.page }, (data) => {
      setRows(data);
    });
  }, [fetchProducts]);

  // Cấu hình các nút Action thô không phụ thuộc UI
  const actionItems = useMemo(() => [
    { key: IAction.EDIT, label: 'Edit', icon: IconName.EDIT },
    { key: IAction.DELETE, label: 'Delete', icon: IconName.DELETE }
  ], []);

  const handleActionClick = useCallback((actionKey: IActionAndSub | IAction, row: Product) => {
    if (actionKey === IAction.EDIT) {
      console.log('Edit item with ID via DataTable prop callback:', row);
    } else if (actionKey === IAction.DELETE) {
      console.log('Delete item with ID via DataTable prop callback:', row);
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
          autoRowHeight
          rows={rows}
          rowCount={200}
          handlePagination={handlePagination}
          actionBars={actionItems}
          handleActionClick={handleActionClick}
          checkboxSelection
        />
      </MainCard>
    </ContainerWrapper>
  );
}
