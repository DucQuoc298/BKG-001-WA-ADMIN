import { Button, ContainerWrapper, MainCard, TextField } from 'components';
import React, { useCallback } from 'react';
import { useHome, useReduxFormSync } from 'hooks';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import DateField from 'components/DateField/DateField';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { HomeFormData, initialHomeForm } from 'store/home/reducer';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Home() {

  const { homeForm, update } = useHome();
  const validationSchema = Yup.object().shape({
    // date: Yup.mixed<Dayjs>().required('Expired Date is required'),

  });

  const methods = useForm<HomeFormData>({
    defaultValues: initialHomeForm,
    resolver: yupResolver(validationSchema) as any,
    mode: 'onBlur'
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      dirtyFields,
    },
  } = methods;

  useReduxFormSync({
    methods,
    values: homeForm,
    onSave: update,
  });

  const onSubmit = useCallback((_data: HomeFormData) => {
    console.log('homeForm', _data, dirtyFields)
  }, [dirtyFields])

  return (
    <FormProvider {...methods}>
      <ContainerWrapper
        toolbarLocalProps={{
          title: 'Home',

        }}
      >
        <MainCard>
          <Button
            onClick={handleSubmit(onSubmit)}
            text='Submit'
          />
          <TextField label={'test'} {...register('note')} />
          <Controller
            name='date'
            control={methods.control}
            render={({ field }) => (
              <DateField
                label="Chose month"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange as any}
                value={field.value as any}
                setValue={(val) => {
                  field.onChange(val);
                  setValue('date', val, {
                    shouldDirty: true,
                  });
                }}
              />
            )}
          />
        </MainCard>
      </ContainerWrapper>
    </FormProvider>
  );
}
