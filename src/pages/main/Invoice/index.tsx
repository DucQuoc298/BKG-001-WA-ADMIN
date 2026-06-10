import { Box, Tab, Tabs, Stack, Typography } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import Icons, { IconName } from 'assets/Icon';
import { ContainerWrapper, MainCard, DataTable, TextField, Autocomplete, Button } from 'components';
import React, { useCallback, useMemo } from 'react';
import { EGridColTypes, IGridColDef } from 'types/components/grid';
import { useInvoice } from 'hooks/useInvoice';
import { useSnackbar } from 'hooks/useSnackbar';

type Product = {
  id: number;
  title: string;
  brand?: string;
  price?: number;
};

const columnsDefinition: IGridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'brand', headerName: 'Brand', width: 130, flex: 1 },
  { field: 'price', headerName: 'Price', width: 130, flex: 1, type: EGridColTypes.ABS_NUMBER },
  { field: 'sell', headerName: 'Sell', width: 130, flex: 1, type: EGridColTypes.DATETIME },
];

export default function Invoice() {
  const apiGridRef1 = useGridApiRef();

  const {
    invoiceForm,
    formState,
    listState,
    update,
    openForm,
    resetForm,
    updateTab,
    setSaving
  } = useInvoice();

  const { success, error: toastError } = useSnackbar();

  // Store for List DataTable (Remote search for phone)
  const productStore1 = useMemo(() => ({
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


  // Store for Autocomplete in Form (Remote search for any product)
  const productSearchStore = useMemo(() => ({
    cacheKey: 'invoice-form-product-search',
    mode: 'remote' as const,
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

  // Columns definition of actions
  const actionItems = useMemo(() => [
    { key: 'edit', label: 'Edit', icon: IconName.EDIT },
    { key: 'delete', label: 'Delete', icon: IconName.DELETE }
  ], []);

  // Handle Action click
  const handleActionClick = useCallback((actionKey: any, row: any) => {
    if (actionKey === 'form') {
      // Mở Form ở chế độ Edit và điền dữ liệu của row vào
      openForm('edit', row.id, {
        customerName: `Khách hàng - Hóa đơn #${row.id}`,
        product: row,
      });
      updateTab('form'); // Switch sang Tab Form
      success(`Đã tải thông tin hóa đơn #${row.id} lên Form.`);
    } else if (actionKey === 'delete') {
      success(`Xóa thành công hóa đơn #${row.id} (Giả lập)`);
    }
  }, [openForm, updateTab, success]);

  // Handle Tab change
  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: string) => {
    updateTab(newValue);
    if (newValue === 'form' && formState?.mode === 'view') {
      openForm('create'); // Nếu click vào tab Form mà chưa có gì thì mặc định là tạo mới
    }
  }, [updateTab, formState?.mode, openForm]);

  // Handle Save Form
  const handleSave = useCallback(() => {
    if (!invoiceForm?.customerName?.trim()) {
      toastError('Vui lòng nhập tên khách hàng!');
      return;
    }
    if (!invoiceForm?.product) {
      toastError('Vui lòng chọn sản phẩm!');
      return;
    }

    setSaving(true);
    // Giả lập lưu dữ liệu bất đồng bộ 1.2s
    setTimeout(() => {
      setSaving(false);
      success(
        formState?.mode === 'create'
          ? 'Tạo mới hóa đơn thành công!'
          : `Cập nhật hóa đơn #${formState?.activeId} thành công!`
      );
      resetForm();
      updateTab('view'); // Quay lại trang danh sách
    }, 1200);
  }, [invoiceForm, formState, setSaving, success, toastError, resetForm, updateTab]);
  console.log(formState);
  return (
    <ContainerWrapper
      toolbarLocalProps={{
        title: 'Invoice Management',
      }}
    >
      <MainCard>
        {/* Navigation Tabs */}
        <Tabs
          value={listState?.activeTab || 'view'}
          // onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab value="view" label="Danh Sách Hóa Đơn" onClick={(e) => handleTabChange(e, 'view')} />
          <Tab
            value="form"
            label={formState?.mode === 'create' ? 'Tạo Mới Hóa Đơn' : `Chỉnh Sửa (#${formState?.activeId})`}
            onClick={(e) => handleTabChange(e, 'form')}
          />
        </Tabs>

        {/* List panel */}
        {listState?.activeTab === 'view' && (
          <Box>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              {/* <Typography variant="h5">Danh sách các sản phẩm/hóa đơn</Typography> */}
              <Button
                text="Tạo Mới Hóa Đơn"
                variant="contained"
                startIcon={<Icons name={IconName.NEW} size={18} />}
                onClick={() => {
                  openForm('create');
                  updateTab('form');
                }}
              />
            </Stack>
            <DataTable
              apiRef={apiGridRef1}
              variant="view"
              columns={columnsDefinition}
              store={productStore1}
              actionBars={actionItems as any}
              handleActionClick={handleActionClick}
              checkboxSelection
            />
          </Box>
        )}

        {/* Form panel */}
        {listState?.activeTab === 'form' && (
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {formState?.mode === 'create' ? 'Tạo mới hóa đơn nghiệp vụ' : `Cập nhật hóa đơn nghiệp vụ #${formState?.activeId}`}
            </Typography>

            <Stack sx={{ gap: 3, maxWidth: 600 }}>
              <TextField
                fullWidth
                required
                label="Tên khách hàng"
                value={invoiceForm?.customerName || ''}
                onChange={(e) => update({ customerName: e.target.value })}
                placeholder="Nhập tên khách hàng..."
              />

              <Autocomplete
                label="Sản phẩm hóa đơn"
                idField="id"
                textField="title"
                store={productSearchStore}
                value={invoiceForm?.product || null}
                onChange={(event, newValue) => {
                  update({ product: newValue });
                }}
                required
              />

              <Stack direction="row" sx={{ gap: 2, mt: 2 }}>
                <Button
                  text={formState?.saving ? "Đang Lưu..." : "Lưu Hóa Đơn"}
                  variant="contained"
                  onClick={handleSave}
                  disabled={formState?.saving}
                />
                <Button
                  text="Hủy Bỏ"
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    resetForm();
                    updateTab('view');
                  }}
                  disabled={formState?.saving}
                />
              </Stack>
            </Stack>
          </Box>
        )}
      </MainCard>
    </ContainerWrapper>
  );
}
