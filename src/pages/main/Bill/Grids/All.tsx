import { Box } from "@mui/material"
import { IconName } from "assets/Icon";
import { DataTable } from "components";
import ActionBar from "components/ActionBar";
import { useSnackbar } from "hooks";
import { useBill } from "hooks/useBill";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DataTableMode, DataTableVariant, EGridColTypes, IAction, IActionAndSub, IGridColDef, IToolbarButton, actionButtons } from "types";
import { resolveActionButtons } from "utils";


type Product = {
  id: number;
  title: string;
  brand?: string;
  price?: number;
};

interface GridAllProps {
  onButtonClick?: (actionKey: IAction | IActionAndSub) => void;
}

const GridAll = ({ onButtonClick }: GridAllProps) => {
  const { t } = useTranslation();
  const { success } = useSnackbar();
  const { updateSearch, listState } = useBill();
  console.log(listState.searchKeyword)

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

  const handleActionClick = useCallback((actionKey: any, row: any) => {
    if (actionKey === 'form') {
      success(`Đã tải thông tin hóa đơn #${row.id} lên Form.`);
    } else if (actionKey === 'delete') {
      success(`Xóa thành công hóa đơn #${row.id} (Giả lập)`);
    }
  }, [success]);

  const buttons: (IAction | IToolbarButton)[] = useMemo(() => [
    IAction.EDIT,
    {
      key: IAction.NEW,
      label: t('button.new'),
      icon: IconName.NEW,
    },
    IAction.DELETE,
  ], [t]);

  // Resolve IAction strings to full button objects (same pattern as ToolBarLocal)
  const buttonsResolved = useMemo(() => {
    return resolveActionButtons(actionButtons, buttons)
  }, [buttons, t]);

  console.log(buttonsResolved)

  return (
    <Box >
      <ActionBar
        buttons={buttonsResolved}
        onButtonClick={onButtonClick}
        onSearchChange={(value) => {
          updateSearch(value ?? "")
        }}
        searchValue={listState.searchKeyword}
      />
      <DataTable
        variant={DataTableVariant.VIEW}
        columns={columnsDefinition}
        store={productStore}
        actionBars={actionItems as any}
        handleActionClick={handleActionClick}
        checkboxSelection
      />
    </Box>
  );

}

export default GridAll