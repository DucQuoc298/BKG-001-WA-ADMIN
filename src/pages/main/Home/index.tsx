import { Button, Chip, ContainerWrapper, MainCard, NumberField, TextField, EmailBox, DropDownList } from 'components';
import React, { useCallback, useEffect } from 'react';
import { useHome, useReduxFormSync, useEmail, useSnackbar, EmailFormFields } from 'hooks';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { HomeFormFields, initialHomeFormFields } from 'store/home/reducer';
import { DateRangeField } from 'components/DateField';
import { Box } from '@mui/material';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Home() {
  const { success } = useSnackbar();
  // Lấy state form hiện tại từ Redux và hàm cập nhật
  const { formState, updateForm } = useHome();
  const { addComposer, removeComposer } = useEmail();

  // Đảm bảo khởi tạo composer cho hộp thư riêng của trang chủ (home-mailbox)
  useEffect(() => {
    addComposer('home-mailbox');
  }, [addComposer]);

  const validationSchema = Yup.object().shape({
    // date: Yup.mixed<Dayjs>().required('Expired Date is required'),
    number: Yup.number().required('Number is required'),
    // role: Yup.string().required('Role is required'),
  });

  const methods = useForm<HomeFormFields>({
    defaultValues: {
      ...initialHomeFormFields,
      role: ['guest']
    },
    resolver: yupResolver(validationSchema) as any,
    mode: 'onBlur'
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      dirtyFields,
      errors
    },
  } = methods;
  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = watch();
  /**
   * useReduxFormSync đồng bộ hóa dữ liệu React Hook Form ↔ Redux.
   */
  useReduxFormSync<HomeFormFields>({
    methods,
    values: {
      ...(formState?.data ?? {}),
      role: formState?.data?.role ?? formValues.role,
      dirtyFields: formState?.dirtyFields,
    },
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

  const handleSend = (id: string, data: EmailFormFields) => {
    let successMessage = `Đã gửi email thành công từ Trang chủ tới ${data.recipient}!`;
    if (data.showCc && data.cc) successMessage += ` (Cc: ${data.cc})`;
    if (data.attachments && data.attachments.length > 0) {
      successMessage += ` (Đính kèm ${data.attachments.length} tệp)`;
    }
    success(successMessage);
    // Đối với trang chủ, chúng ta chỉ reset chứ không xóa composer để giữ nguyên khung giao diện
    if (id !== 'home-mailbox') {
      removeComposer(id);
    }
  };

  const handleDiscard = (id: string) => {
    if (id !== 'home-mailbox') {
      removeComposer(id);
    }
    success('Đã hủy bản nháp email');
  };

  return (
    <FormProvider {...methods}>
      <ContainerWrapper
        toolbarLocalProps={{
          title: 'Home',
        }}
      >
        <MainCard>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              onClick={handleSubmit(onSubmit)}
              text='Submit'
            />
          </Box>
          <TextField label={'test'} {...register('note')} />
          <NumberField
            label='Số'
            required
            {...register('number')}
            value={formValues.number}
            error={!!errors.number}
            helperText={errors.number?.message}
          />
          {/* <DateField
            label="Chose month"
            value={formValues.date}
            {...register('date')}
          /> */}
          <DateRangeField
            label="Chose month range"
            value={[formValues.fromDate, formValues.toDate]}
            {...register('fromDate', {
              onChange: (event) => {
                // DateRangeField emit [startDate, endDate] qua event.target.value
                const [from, to] = event.target.value ?? [null, null];
                setValue('fromDate', from, { shouldDirty: true });
                setValue('toDate', to, { shouldDirty: true });
              }
            })}
          />

          <DropDownList
            label='Role'
            multiple
            // forceSelect
            {...register('role')}
            value={formValues.role ?? undefined}
            data={[
              { text: 'Admin', id: 'admin' },
              { text: 'User', id: 'user' },
              { text: 'Guest', id: 'guest' },
            ]}
          />
        </MainCard>

        {/* Hộp thư Soạn thảo riêng của trang chủ */}
        <MainCard title="Soạn Email (Hộp thư riêng biệt)" border sx={{ mt: 3 }}>
          <EmailBox
            id="home-mailbox"
            variant="inline"
            onSend={handleSend}
            onDiscard={handleDiscard}
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
