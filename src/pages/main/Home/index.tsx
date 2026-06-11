import { Typography } from '@mui/material';
import { Autocomplete, Button, ContainerWrapper, MainCard, TextField } from 'components';
import React, { useCallback, useMemo, useState } from 'react';
import { IFormMode } from 'types/commom';
import {useHome} from 'hooks';
import { useForm } from 'react-hook-form';
import DateField from 'components/DateField/DateField';
import dayjs from 'dayjs';
import DateRangeField from 'components/DateField/DateRangeField';

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
  
  const { register, formState: { errors }, handleSubmit } = useForm<FormValues>({defaultValues: { product: null, products: null, date: null }, mode: 'onChange'});

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
      <DateField
        type={"month"}
        label={"Chose month"}
        error={!!errors.date}
        helperText={errors.date?.message}
        value={homeForm.date ? dayjs(homeForm.date) : null}
        {...register('date')}
      />
      <DateRangeField 
        label={"Choose date range"}
        required
        error={!!errors.dateRange}
        value={homeForm.dateRange ? [homeForm.dateRange[0] ? dayjs(homeForm.dateRange[0]) : null, homeForm.dateRange[1] ? dayjs(homeForm.dateRange[1]) : null] : [null, null]}
        {...register('dateRange', {
          validate: (value: [Date | null, Date | null] | null) => {
            if (!value || (!value[0] && !value[1])) {
              return 'At least one date is required';
            }

            update({
              dateRange: [
                value[0] ? dayjs(value[0]).toDate() : null,
                value[1] ? dayjs(value[1]).toDate() : null,
              ],
            });
            return true;
          }
        })}
      />
      </MainCard>
    </ContainerWrapper>
  );
}
