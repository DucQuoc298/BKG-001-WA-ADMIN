import { Typography } from '@mui/material';
import { Autocomplete, Button, ContainerWrapper, MainCard, TextField } from 'components';
import React, { useCallback, useMemo, useState } from 'react';
import {useInvoice} from 'hooks';
import { useForm } from 'react-hook-form';
// ==============================|| DASHBOARD - DEFAULT ||============================== //
type Product = {
  id: number;
  title: string;
  brand?: string;
};

interface FormValues {
  product: string | null;
}

export default function Invoice() {
  const { update, invoiceForm } = useInvoice();

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({defaultValues: { product: invoiceForm.product }, mode: 'onChange'});

  const fetchProducts = useCallback(async ({ keyword, page}: {
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

  const productStore = useMemo(
    () => ({
      mode: 'remote' as const,
      params: { keyword: 'phone', page: 0 },
      fnGetData: fetchProducts,
    }),
    [fetchProducts]
  );

  return (
    <ContainerWrapper
      toolbarLocalProps={{ 
        title: 'Invoice',
      }}
    >
      <MainCard>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Invoice
      </Typography>
      <TextField label="Customer Name" name="customerName" value={invoiceForm.customerName || ''} onChange={(e) => update({ customerName: e.target.value })} />
      <Autocomplete 
        idField="id"
        textField="title"
        label="Product"
        error={!!errors.product}
        helperText={errors.product?.message}
        loading={loading}
        required
        value={invoiceForm.product || null}
        defaultValue={invoiceForm.product || null}
        store={productStore}
        {...register('product', { validate: (value: string | null) => {
          if (!value) {
            return 'Product is required';
            }
            console.log(value);
          update({ product: value as any });
          return true;
        } })}
        />
        <Button onClick={handleSubmit((data) => console.log("data", data))} text="Submit"></Button>
      </MainCard>
    </ContainerWrapper>
  );
}
