import { Box, Typography } from "@mui/material"
import { useMemo } from "react";
import { DataTableMode } from "types";



const GridAll = () => {

  const productSearchStore = useMemo(() => ({
    cacheKey: 'bill-grid-all-product-search',
    mode: DataTableMode.REMOTE as const,
    fnGetData: (
      params: { keyword: string; page: number; pageSize: number },
      onSuccess?: (data: any[], total?: number) => void
    ) => {
      const { keyword, page, pageSize } = params;
      fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(
          keyword || ''
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
  return (
    <Box>
      <Typography variant="h6">All</Typography>
    </Box>
  );

}

export default GridAll