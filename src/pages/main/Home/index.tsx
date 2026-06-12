import { Button, Chip, ContainerWrapper, MainCard, TextField } from 'components';
import React, { useCallback } from 'react';
import { useHome, useReduxFormSync } from 'hooks';
import { useForm, FormProvider } from 'react-hook-form';
import DateField from 'components/DateField/DateField';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { HomeFormFields, initialHomeFormFields } from 'store/home/reducer';
import { DateRangeField } from 'components/DateField';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Home() {
  // Lấy state form hiện tại từ Redux và hàm cập nhật
  const { formState, updateForm } = useHome();

  const validationSchema = Yup.object().shape({
    // date: Yup.mixed<Dayjs>().required('Expired Date is required'),
  });

  const methods = useForm<HomeFormFields>({
    defaultValues: initialHomeFormFields,
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

  /**
   * useReduxFormSync đồng bộ hóa dữ liệu React Hook Form ↔ Redux.
   * - values: truyền `formState` (chứa data + dirtyFields + formMode)
   *   và hook sẽ tự lấy `values.data` để nạp vào các field của form.
   * - onSave: khi component unmount, snapshot toàn bộ form state
   *   (bao gồm dirtyFields) được lưu vào Redux thông qua `updateForm`.
   *
   * Lưu ý: useReduxFormSync nhận `values` với cấu trúc { data, dirtyFields, formMode }
   * và chỉ set những key không phải `dirtyFields` vào form,
   * còn dirtyFields dùng để khôi phục trạng thái dirty của từng field.
   */
  useReduxFormSync<HomeFormFields>({
    methods,
    // Truyền `data` của formState làm snapshot để sync
    values: {
      ...(formState?.data ?? {}),
      dirtyFields: formState?.dirtyFields,
    },
    // Khi unmount: lưu data + dirtyFields mới nhất vào Redux
    onSave: (snapshot) => {
      const { dirtyFields: savedDirtyFields, ...data } = snapshot;
      updateForm({
        data: data as HomeFormFields,
        dirtyFields: savedDirtyFields ?? {},
      });
    },
  });

  const onSubmit = useCallback((_data: HomeFormFields) => {
    console.log('homeForm', _data, dirtyFields);
  }, [dirtyFields]);

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
          <DateField
            label="Chose month"
            value={formState?.data?.date}
            {...register('date')}
          />
          <DateRangeField
            label="Chose month range"
            value={[formState?.data?.fromDate, formState?.data?.toDate]}
            {...register('fromDate', {
              onChange: (event) => {
                // DateRangeField emit [startDate, endDate] qua event.target.value
                // Vì fromDate và toDate là 2 field riêng biệt trong RHF,
                // ta phải set từng field một thay vì dùng setValues
                const [from, to] = event.target.value ?? [null, null];
                setValue('fromDate', from, { shouldDirty: true });
                setValue('toDate', to, { shouldDirty: true });
              }
            })}
          />
        </MainCard>

        <MainCard>
          <Chip color='primary' title='primary' />
          <Chip color='secondary' title='secondary' />
          <Chip color='success' title='success' />
          <Chip color='error' title='error' />
          <Chip color='warning' title='warning' />
        </MainCard>
      </ContainerWrapper>
    </FormProvider>
  );
}
