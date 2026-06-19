import React, { useEffect, useRef, useState } from 'react';

// material-ui
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// third-party
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import AnimateButton from 'components/@extended/AnimateButton';
import DatePicker from 'components/@extended/DatePicker';
import { Button, TextField } from 'components';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { IconButton, Input, InputAdornment } from '@mui/material';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useSnackbar } from 'hooks/useSnackbar';
import { AuthNameRoutes } from 'routes/AuthRoutes';

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
  const [loading, setLoading] = useState(false);
  const [isRevise, setIsRevise] = useState(true);
  const { success } = useSnackbar();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm<IFormValues>({
    defaultValues: {
      expiryDate: null,
      company: '',
      license: '',
    },
    resolver: yupResolver(validationSchema) as any,
    mode: 'onSubmit'
  });

  watch(['expiryDate', 'company', 'license']);


  const onGetInformationRegister = async () => {
    setLoading(true);
    const company = watch('company');
    const expiryDate = watch('expiryDate')?.format('YYYY-MM-DD');

    if (!company || !expiryDate) return;

    const getFilenameFromDisposition = (disposition?: string) => {
      if (!disposition) return undefined;
      const utf8Name = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
      if (utf8Name) return decodeURIComponent(utf8Name);
      const normalName = disposition.match(/filename="?([^";]+)"?/i)?.[1];
      return normalName;
    };

    const triggerDownload = (blob: Blob, fileName: string) => {
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    };


  };
  const onSubmit = (data: IFormValues) => {

  };

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
                  // error={errors.expiryDate?.message}
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
                onClick={onGetInformationRegister}
                disabled={loading}
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
      <Grid container sx={{ spacing: 3, mt: 2 }}>
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
                  onClick={() => handleSubmit(onSubmit)()}
                  text={t('AUTH.register_button')}
                />
              </AnimateButton>
            </Grid>
            <Typography sx={{ textAlign: "center" }} component={RouterLink} to="/login" variant="body1" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              {t('AUTH.back_to_login')}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
