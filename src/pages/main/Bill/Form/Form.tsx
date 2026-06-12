import { Button, DataTable, MainCard } from "components";
import { useBill } from "hooks/useBill";
import { DataTableMode, DataTableVariant, EFormMode, EGridColTypes, IGridColDef } from "types";
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
  const { openForm } = useBill()

  const productStore = useMemo(() => ({
    cacheKey: 'bill-products',
    mode: DataTableMode.LOCAL as const,
    data: [
      { id: 1, title: "", brand: "", price: undefined, category: "" }
    ] as unknown as Product[]
    // params: { keyword: 'phone' },
    // fnGetData: (
    //   params: { keyword: string; page: number; pageSize: number },
    //   onSuccess?: (data: Product[], total?: number) => void
    // ) => {
    //   const { keyword, page, pageSize } = params;
    //   if (!keyword || !keyword.trim()) {
    //     onSuccess?.([]);
    //     return;
    //   }

    //   fetch(
    //     `https://dummyjson.com/products/search?q=${encodeURIComponent(
    //       keyword
    //     )}&limit=${pageSize}&skip=${page * pageSize}`
    //   )
    //     .then((res) => res.json())
    //     .then((data) => {
    //       onSuccess?.(data.products ?? [], data.total ?? 0);
    //     })
    //     .catch(() => {
    //       onSuccess?.([]);
    //     });
    // }

  }), []);

  const categoryStore = useMemo(() => ({
    mode: DataTableMode.REMOTE as const,
    cacheKey: 'bill-categories',
    fnGetData: (
      params: { keyword: string; page: number; pageSize: number; searchString?: string },
      onSuccess?: (result: any[]) => void
    ) => {
      fetch('https://dummyjson.com/products/categories')
        .then((res) => res.json())
        .then((data: any[]) => {
          const mapped = data.map((item) => ({
            slug: item.slug,
            name: item.name,
          }));

          const search = (params.searchString || params.keyword || '').toLowerCase();
          const filtered = mapped.filter((item) =>
            item.name.toLowerCase().includes(search) || item.slug.toLowerCase().includes(search)
          );

          const page = params.page ?? 0;
          const pageSize = params.pageSize ?? 7;
          const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

          onSuccess?.(paginated);
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
    { field: 'id', headerName: 'ID', width: 70, },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'brand', headerName: 'Brand', width: 130, flex: 1 },
    { field: 'price', headerName: 'Price', width: 130, flex: 1, type: EGridColTypes.ABS_NUMBER },
    {
      field: 'category',
      headerName: 'Category',
      width: 180,
      flex: 1,
      type: EGridColTypes.AUTOCOMPLETE,
      store: categoryStore,
      idField: 'slug',
      textField: 'name',
      editable: true,
    },
    { field: 'sell', headerName: 'Sell', width: 130, flex: 1, type: EGridColTypes.DATETIME },
  ];

  return (
    <MainCard>
      <Button text="Back" onClick={() => { openForm(EFormMode.LIST) }} />
      <DataTable
        variant={DataTableVariant.FORM}
        columns={columnsDefinition}
        store={productStore}
        actionBars={actionItems as any}
        handleActionClick={handleActionClick}
        autoRowHeight
      />

    </MainCard>
  )

}
export default BillForm;