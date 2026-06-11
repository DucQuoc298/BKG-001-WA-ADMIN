import { Grid } from "@mui/system";
import { Button, DataTable, MainCard, TextField } from "components";
import { useBill } from "hooks/useBill";
import { DataTableMode, DataTableVariant, EFormMode, EGridColTypes, IGridColDef } from "types";
import { styles as defaultStyles } from "themes/config"
import { useMemo } from "react";
import { IconName } from "assets/Icon";

type Product = {
  id: number;
  title: string;
  brand?: string;
  price?: number;
};

interface IBillForm {
  handleActionClick: (actionKey: any, row: any) => void;
}
const BillForm = ({ handleActionClick }: IBillForm) => {
  const { billForm, update, openForm } = useBill()

  const productStore = useMemo(() => ({
    cacheKey: 'bill-products',
    mode: DataTableMode.REMOTE as const,
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

  const actionItems = useMemo(() => [
    { key: 'edit', label: 'Edit', icon: IconName.EDIT },
    { key: 'delete', label: 'Delete', icon: IconName.DELETE }
  ], []);

  const columnsDefinition: IGridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'brand', headerName: 'Brand', width: 130, flex: 1 },
    { field: 'price', headerName: 'Price', width: 130, flex: 1, type: EGridColTypes.ABS_NUMBER },
    { field: 'sell', headerName: 'Sell', width: 130, flex: 1, type: EGridColTypes.DATETIME },
  ];

  return (
    <MainCard>
      <Button text="Back" onClick={() => { openForm(EFormMode.LIST) }} />
      <DataTable
        variant={DataTableVariant.VIEW}
        columns={columnsDefinition}
        store={productStore}
        actionBars={actionItems as any}
        handleActionClick={handleActionClick}
        checkboxSelection
      />

    </MainCard>
  )

}
export default BillForm;