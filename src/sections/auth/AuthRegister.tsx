import React, { useRef, useState, useTransition } from 'react';

// material-ui
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

// third-party
import * as Yup from 'yup';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import AnimateButton from 'components/@extended/AnimateButton';
import { Button, DatePicker, TextField } from 'components';
import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';
import { IconButton, Input, InputAdornment } from '@mui/material';
import { CloudUploadOutlined } from '@ant-design/icons';

// ============================|| JWT - REGISTER ||============================ //

interface IFormValues {
  expiryDate: Dayjs | null;
  company: string;
  license: string;
}

const validationSchema = Yup.object().shape({
  company: Yup.string().max(255).required('Company is required'),
  expiryDate: Yup.mixed<Dayjs>().required('Expired Date is required'),
  license: Yup.string()
    .required('License is required')
    .test('no-leading-trailing-whitespace', 'License cannot start or end with spaces', (value) => value === value?.trim())

});

export default function AuthRegister() {
  const { t } = useTranslation();
  const fileRef = useRef<any>(null);
  const [isPending] = useTransition();
  const [isRevise, setIsRevise] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    control,
    register,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      expiryDate: null,
      company: '',
      license: '',
    },
    resolver: yupResolver(validationSchema) as any,
    mode: 'onSubmit'
  });

  useWatch({ control, name: ['expiryDate', 'company', 'license'] });

  const handleLicenseFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack sx={{ gap: 1 }}>
            <Typography variant="h3">{t('AUTH.server_license')}</Typography>
            <TextField
              {...register('company', { required: true })}
              error={Boolean(errors.company)}
              errors={errors.company?.message}
              id="company-signup"
              label={t('AUTH.company')}
              disabled={isRevise}
            />
          </Stack>
        </Grid>
        <Grid size={12}>
          <Stack sx={{ gap: 1 }}>
            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t('AUTH.expired_date')}
                  value={field.value}
                  onChange={(date: Dayjs | null) => field.onChange(date)}
                  error={errors.expiryDate?.message}
                  disabled={isRevise}
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid size={12}>
          <Stack sx={{ gap: 1 }}>
            <TextField
              {...register('license')}
              label={t('AUTH.license')}
              fullWidth
              error={Boolean(errors.license)}
              id="license-signup"
              errors={errors.license?.message}
              disabled={isRevise}
            />
          </Stack>
        </Grid>
        {errors.root && (
          <Grid size={12}>
            <FormHelperText error>{errors.root.message}</FormHelperText>
          </Grid>
        )}
        <Grid container size={12}>
          <Grid size={6}>
            <AnimateButton>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                color="primary"
                // onClick={onGetInformationRegister} 
                disabled={isPending}
                text={t('AUTH.get_license_info')}
              />
            </AnimateButton>
          </Grid>
          <Grid size={6}>
            <AnimateButton>
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                onClick={() => setIsRevise(!isRevise)}
                text={t('AUTH.revise')}
              />
            </AnimateButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={12}>
          <Stack sx={{ gap: 1 }}>
            <Typography variant="h3">{t('AUTH.user_license')}</Typography>
            <TextField
              onFocus={(e) => {
                e.target.blur();
              }}
              error={false}
              id="user-license"
              name="user-license"
              label={t('AUTH.license_file')}
              value={selectedFile?.name || ''}
              onClick={() => { fileRef.current.click(); }}
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" color="secondary">
                        <CloudUploadOutlined />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Input type="file" sx={{ display: 'none' }} inputRef={fileRef} onChange={handleLicenseFileChange} />
            <Grid size={12} sx={{ mt: 1 }}>
              <AnimateButton>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="primary"
                  // onClick={() => handleSubmit(onSubmit)()} 
                  text={t('AUTH.register_button')}
                />
              </AnimateButton>
            </Grid>
            <Typography component={RouterLink} to="/login" variant="body1" sx={{ textDecoration: 'none', textAlign: 'center' }} color="primary">
              {t('AUTH.back_to_login')}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
