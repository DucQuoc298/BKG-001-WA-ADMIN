import { Typography } from '@mui/material';
import { Autocomplete, Button, ContainerWrapper, MainCard, TextField } from 'components';
import React, { useCallback, useMemo, useState } from 'react';
import { IFormMode } from 'types/commom';
import {useHome} from 'hooks';
import { Controller, useForm } from 'react-hook-form';
import DateField from 'components/DateField/DateField';
import dayjs from 'dayjs';
import DateRangeField from 'components/DateField/DateRangeField';
import { useTranslation } from 'react-i18next';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
type Product = {
  id: number;
  title: string;
  brand?: string;
};

interface FormValues {
  product: Product | null;
  products: Product[] | null;
  date: Date | null;
  dateRange: [Date | null, Date | null] | null;
}
export default function Home() {

  const { t } = useTranslation();
  const { homeForm, update } = useHome();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {  value } = e.target;

      update({
        note: value,
      })
  };
const [loading, setLoading] = useState(false);
  
  const { register, control, formState: { errors }, handleSubmit, trigger } = useForm<FormValues>({defaultValues: { product: null, products: null, date: null }, mode: 'onChange'});

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
  const getProductById = useCallback(async (id: number, onSuccess?: (data: Product) => void ) => {
    if (!id) return null;

      try {
      setLoading(true);

      const res = await fetch(
        `https://dummyjson.com/products/${id}`
      );

      const data = await res.json();
      if (onSuccess) {
        onSuccess(data as Product);
      }
      return data as Product;
    } finally {
      setLoading(false);
    }
  }, []);

    const productStore = useMemo(
      () => ({
        mode: 'remote' as const,
        params: { keyword: 'phone', page: 0 },
        fnGetData: fetchProducts,
        fnGetDefaultData: getProductById,
      }),
      [fetchProducts, getProductById]
    );

  return (
    <ContainerWrapper
      toolbarLocalProps={{ 
        title: 'Homeasjkbdbajsdjbkabsdabjdsjbk',
        
      }}
    >
      <MainCard>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Home {homeForm.formMode === IFormMode.VIEW ? 'View Mode' : homeForm.formMode === IFormMode.FORM ? 'Edit Mode' : 'New Mode'}
      </Typography>
      <Button variant='contained' text="Open Form" onClick={() => update({ formMode: homeForm.formMode === IFormMode.FORM ? IFormMode.VIEW : IFormMode.FORM })} />
      <Button variant="contained" text="Submit" onClick={handleSubmit((data) => {
        console.log("Form data:", data);
      })} />
      {homeForm.formMode === IFormMode.FORM && (
        <TextField label="Search" variant="outlined" value={homeForm.note} fullWidth onChange={handleChange} />
      )}
      <Autocomplete 
      idField="id"
      textField="title"
      label="Product"
      error={!!errors.product}
      helperText={errors.product?.message}
      loading={loading}
      required
      value={homeForm.product || null}
      limitTags={1}
      store={productStore}
      {...register('product', { validate: (value: Product | null) => {
        if (!value) {
          return 'Product is required';
          }
          console.log(value);
        update({ product: value as any });
        return true;
      } })}
      />
      <Autocomplete 
      idField="id"
      textField="title"
      label="Product"
      error={!!errors.products}
      multiple={true}
      helperText={errors.products?.message}
      loading={loading}
      required
      value={homeForm.products || null}
      limitTags={1}
      store={productStore}
      {...register('products', { validate: (value: Product[] | null) => {
        if (!value || value.length === 0) {
          return 'Products are required';
          }
          console.log(value);
        update({ products: value as any });
        return true;
      } })}
      />
      {/* <DateField
        label={"Choose date"}
        // required
        error={!!errors.date}
        helperText={errors.date?.message}
        value={homeForm.date ? dayjs(homeForm.date) : null}
        {...register('date', {
          validate: (value: Date | null) => {
            if (!value) {
              return 'Date is required';
            }

            update({ date: dayjs(value).toDate() });
            return true;
          }
        })}
      /> */}
      <Controller
        name="date"
        control={control}
        rules={{
          required: t('errors.required', { 0: "Date" }),
        }}
        render={({ field, fieldState }) => (
          <DateField
            required
            label={"Chose month"}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value ? dayjs(field.value) : null}
            onChange={(value) => {
              field.onChange(value?.toDate() ?? null);
            }}
            onBlur={field.onBlur}
          />
        )}
      />
      <Controller 
        name="dateRange"
        control={control}
        rules={{
          validate: (value) => {
            if (!value?.[0] && !value?.[1]) return t('errors.at_least_one_value', { 0: "Date Range" });
            return true;
          },
        }}
        render={({ field, fieldState }) => (
          <DateRangeField 
            label={"Choose date range"}
            required
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value ? [field.value[0] ? dayjs(field.value[0]) : null, field.value[1] ? dayjs(field.value[1]) : null] : [null, null]}
            onChange={(value) => {
              field.onChange([value[0]?.toDate() ?? null, value[1]?.toDate() ?? null]);
              trigger('dateRange');
            }}
            onBlur={field.onBlur}
          />
        )}
      />
      </MainCard>
    </ContainerWrapper>
  );
}
