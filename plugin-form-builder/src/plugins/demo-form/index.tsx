import { definePlugin } from '../../types';

// ── Form Fields Type ─────────────────────────────────────────
type DemoFormFields = {
  customerName: string;
  email: string;
  phone: string;
  note: string;
};

const defaultValues: DemoFormFields = {
  customerName: '',
  email: '',
  phone: '',
  note: '',
};

// ── Plugin Entry ─────────────────────────────────────────────
export const createPluginComponent = definePlugin(({ react: React, sdk }) => {
  const { MainCard, ContainerWrapper, Typography, Button, Stack, TextField } = sdk.components;
  const { useForm, FormProvider } = sdk.form;
  const { useReduxFormSync } = sdk.hooks;
  const { useState } = React;

  function DemoFormPlugin() {
    const methods = useForm({ defaultValues });
    const { register, handleSubmit, watch } = methods;
    const formValues = watch();
    const [submitted, setSubmitted] = useState(false);

    // Lấy state từ Redux (scoped cho plugin này, pluginId đã closure sẵn)
    const pluginState = sdk.store.getPluginFormState();

    // Đồng bộ form ↔ Redux (persist khi navigate đi, restore khi quay lại)
    useReduxFormSync({
      methods,
      values: pluginState
        ? {
            ...pluginState.data,
            dirtyFields: pluginState.dirtyFields,
          }
        : null,
      onSave: (snapshot) => {
        const { dirtyFields, ...data } = snapshot;
        sdk.store.updatePluginForm({ data, dirtyFields });
      },
    });

    const onSubmit = (data: DemoFormFields) => {
      console.log('[demo-form] Submitted:', data);
      setSubmitted(true);
    };

    const handleReset = () => {
      sdk.store.resetPluginForm();
      methods.reset(defaultValues);
      setSubmitted(false);
    };

    return (
      <ContainerWrapper>
        <FormProvider {...methods}>
          <MainCard title="Demo Form Plugin (react-hook-form + Redux Sync)">
            <Stack spacing={2}>
              <TextField
                label="Customer Name"
                {...register('customerName')}
                value={formValues.customerName}
              />
              <TextField
                label="Email"
                {...register('email')}
                value={formValues.email}
              />
              <TextField
                label="Phone"
                {...register('phone')}
                value={formValues.phone}
              />
              <TextField
                label="Note"
                {...register('note')}
                value={formValues.note}
                multiline
              />

              <Stack direction="row" spacing={1}>
                <Button
                  text="Submit"
                  onClick={handleSubmit(onSubmit)}
                />
                <Button
                  text="Reset"
                  onClick={handleReset}
                  color="secondary"
                />
              </Stack>

              {submitted && (
                <Typography color="success.main" variant="body2">
                  ✓ Form submitted successfully!
                </Typography>
              )}
            </Stack>
          </MainCard>
        </FormProvider>
      </ContainerWrapper>
    );
  }

  return DemoFormPlugin;
});
