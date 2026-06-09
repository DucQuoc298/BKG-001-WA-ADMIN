import { ContainerWrapper, MainCard, DataTable } from 'components';
import React, { useCallback, useEffect, useState } from 'react';
import { IGridColDef } from 'types/grid';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

type Product = {
  id: number;
  title: string;
  brand?: string;
};


export default function Invoice() {
  const [, setLoading] = useState(false);
  const [rows, setRows] = useState<Product[]>([]);

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
        )}&limit=10&skip=${page * 10}`
      );

      const data = await res.json();

      const newProducts: Product[] = data.products ?? [];

      if (onSuccess) {
        onSuccess(newProducts);
      }
    } finally {
      setLoading(false);
    }
  },
    []
  );
  const columns: IGridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'brand', headerName: 'Brand', width: 130 },
  ];
  useEffect(() => {
    // Initial fetch with empty keyword to load default products
    fetchProducts({ keyword: '', page: 0 }, (data) => {
      setRows(data);
    });
  }, [fetchProducts]);

  return (
    <ContainerWrapper
      toolbarLocalProps={{
        title: 'Invoiceasjkbdbajsdjbkabsdabjdsjbk',
      }}
    >
      <MainCard>
        <DataTable variant="view" columns={columns} rows={rows} />
      </MainCard>
      <MainCard sx={{ mt: 2 }}>
        <DataTable variant="edit" columns={columns} rows={rows} />
      </MainCard>
    </ContainerWrapper>
  );
}
