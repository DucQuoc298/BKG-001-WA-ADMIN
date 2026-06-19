import { Box } from "@mui/system";
import React, { useRef, useEffect } from "react";
import createStyles from './styles';
import { IconButton, InputBase, Typography, useTheme } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import TipTap from "./TipTap";
import { useEmail, EmailFormFields, initialEmailFormFields } from 'hooks';

interface IEmailBoxProps {
  id: string;
  onSend: (id: string, data: EmailFormFields) => void;
  onDiscard: (id: string) => void;
  variant?: 'floating' | 'inline';
}

const validationSchema = Yup.object().shape({
  recipient: Yup.string()
    .required('Vui lòng nhập địa chỉ email người nhận')
    .test('valid-email', 'Địa chỉ email không hợp lệ', (value) => !value || /\S+@\S+\.\S+/.test(value)),
  cc: Yup.string()
    .nullable()
    .test('valid-cc', 'Địa chỉ email Cc không hợp lệ', (value) => !value || /\S+@\S+\.\S+/.test(value)),
  bcc: Yup.string()
    .nullable()
    .test('valid-bcc', 'Địa chỉ email Bcc không hợp lệ', (value) => !value || /\S+@\S+\.\S+/.test(value)),
  subject: Yup.string().required('Vui lòng nhập tiêu đề email'),
  content: Yup.string().optional(),
});

const EmailBox = ({
  id,
  onDiscard,
  onSend,
  variant = 'floating'
}: IEmailBoxProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getComposer, updateComposer, activeComposerId, setActiveComposer } = useEmail();

  // Lấy dữ liệu composer tương ứng từ cache Map
  const composer = getComposer(id);

  // Khởi tạo form cục bộ cho riêng instance này với dữ liệu từ cache
  const methods = useForm<EmailFormFields>({
    defaultValues: composer?.data,
    resolver: yupResolver(validationSchema) as any,
    mode: 'onBlur',
  });

  const { register, watch, setValue, formState: { errors } } = methods;

  const subject = watch('subject');
  const content = watch('content');
  const showCc = watch('showCc');
  const showBcc = watch('showBcc');
  const attachments = watch('attachments') ?? [];

  // Đồng bộ hóa dữ liệu từ local React Hook Form lên global cache khi có thay đổi để phục vụ Live Preview
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((value) => {
      updateComposer(id, {
        data: {
          recipient: value.recipient ?? '',
          subject: value.subject ?? '',
          content: value.content ?? '',
          cc: value.cc ?? '',
          bcc: value.bcc ?? '',
          showCc: Boolean(value.showCc),
          showBcc: Boolean(value.showBcc),
          attachments: value.attachments ?? [],
        },
        dirtyFields: methods.formState.dirtyFields,
      });
    });
    return () => subscription.unsubscribe();
  }, [id, methods, updateComposer, watch]);

  if (!composer) {
    return null;
  }

  const { isMinimized } = composer;
  const isActive = activeComposerId === id;

  const handleFocus = () => {
    if (!isActive) {
      setActiveComposer(id);
    }
  };

  const handleMinimizeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateComposer(id, { isMinimized: !isMinimized });
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onDiscard(id);
    methods.reset(initialEmailFormFields);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const filtered = newFiles.filter(
        (nf) => !attachments.some((pf) => pf.name === nf.name && pf.size === nf.size)
      );
      setValue('attachments', [...attachments, ...filtered], { shouldDirty: true });
    }
  };

  const removeAttachment = (index: number) => {
    setValue('attachments', attachments.filter((_, i) => i !== index), { shouldDirty: true });
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const setShowCc = (val: boolean) => setValue('showCc', val, { shouldDirty: true });
  const setShowBcc = (val: boolean) => setValue('showBcc', val, { shouldDirty: true });

  const handleSend = () => {
    methods.handleSubmit(
      (formData) => {
        onSend(id, formData);
        methods.reset(initialEmailFormFields);
      },
      () => {
        // Mở rộng cửa sổ nếu có lỗi validation
        updateComposer(id, { isMinimized: false });
      }
    )();
  };

  return (
    <FormProvider {...methods}>
      <Box
        onClick={handleFocus}
        sx={{
          ...styles.container(variant),
          height: isMinimized && variant === 'floating' ? '44px' : 'auto',
          border: isActive && variant === 'floating' ? `1px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
          boxShadow: variant === 'floating' ? (isActive ? theme.shadows[6] : theme.shadows[2]) : 'none',
          zIndex: variant === 'floating' ? (isActive ? 1001 : 1000) : undefined,
        }}
      >
        {/* HEADER */}
        <Box
          onClick={variant === 'floating' ? handleMinimizeToggle : undefined}
          sx={{
            ...styles.header.container,
            borderBottom: isMinimized && variant === 'floating' ? 'none' : `1px solid ${theme.palette.grey['200']}`,
            bgcolor: isActive && variant === 'floating' ? theme.palette.primary.main : theme.palette.grey[100],
            color: isActive && variant === 'floating' ? theme.palette.primary.contrastText : theme.palette.text.primary,
            cursor: variant === 'floating' ? 'pointer' : 'default',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              ...styles.header.title,
              color: 'inherit',
              fontWeight: isActive && variant === 'floating' ? 600 : 500
            }}
          >
            {subject || 'Thư mới'}
          </Typography>
          {variant === 'floating' && (
            <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
              <IconButton size="small" onClick={handleMinimizeToggle} sx={{ ...styles.header.btn, color: 'inherit' }}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleClose} sx={{ ...styles.header.btn, color: 'inherit' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* COMPOSER BODY */}
        {(!isMinimized || variant === 'inline') && (
          <Box sx={styles.body.container}>
            {/* To Row */}
            <Box sx={styles.body.toRow.container(!!errors.recipient)}>
              <Typography variant="body2" sx={styles.body.toRow.label}>
                Đến:
              </Typography>
              <InputBase
                placeholder="partner@example.com"
                {...register('recipient')}
                fullWidth
                sx={styles.body.toRow.input}
              />

              {/* Toggles for Cc/Bcc */}
              <Box sx={styles.body.toRow.toggles}>
                {!showCc && (
                  <Typography
                    variant="body2"
                    onClick={() => setShowCc(true)}
                    sx={styles.body.toRow.toggleBtn}
                  >
                    Cc
                  </Typography>
                )}
                {!showBcc && (
                  <Typography
                    variant="body2"
                    onClick={() => setShowBcc(true)}
                    sx={styles.body.toRow.toggleBtn}
                  >
                    Bcc
                  </Typography>
                )}
              </Box>
            </Box>
            {errors.recipient && (
              <Typography variant="caption" color="error" sx={styles.body.errorText}>
                {errors.recipient.message}
              </Typography>
            )}

            {/* Cc Row */}
            {showCc && (
              <Box sx={styles.body.ccRow.container(!!errors.cc)}>
                <Typography variant="body2" sx={styles.body.toRow.label}>
                  Cc:
                </Typography>
                <InputBase
                  placeholder="cc@example.com"
                  {...register('cc')}
                  fullWidth
                  sx={styles.body.toRow.input}
                />
                <IconButton size="small" onClick={() => { setShowCc(false); setValue('cc', ''); }} sx={styles.body.ccRow.closeBtn}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            )}
            {errors.cc && (
              <Typography variant="caption" color="error" sx={styles.body.errorText}>
                {errors.cc.message}
              </Typography>
            )}

            {/* Bcc Row */}
            {showBcc && (
              <Box sx={styles.body.bccRow.container(!!errors.bcc)}>
                <Typography variant="body2" sx={styles.body.toRow.label}>
                  Bcc:
                </Typography>
                <InputBase
                  placeholder="bcc@example.com"
                  {...register('bcc')}
                  fullWidth
                  sx={styles.body.toRow.input}
                />
                <IconButton size="small" onClick={() => { setShowBcc(false); setValue('bcc', ''); }} sx={styles.body.bccRow.closeBtn}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            )}
            {errors.bcc && (
              <Typography variant="caption" color="error" sx={styles.body.errorText}>
                {errors.bcc.message}
              </Typography>
            )}

            {/* Subject Row */}
            <Box sx={styles.body.subjectRow.container(!!errors.subject)}>
              <Typography variant="body2" sx={styles.body.toRow.label}>
                Tiêu đề:
              </Typography>
              <InputBase
                placeholder="Nhập tiêu đề email..."
                {...register('subject')}
                fullWidth
                sx={styles.body.toRow.input}
              />
            </Box>
            {errors.subject && (
              <Typography variant="caption" color="error" sx={styles.body.subjectErrorText}>
                {errors.subject.message}
              </Typography>
            )}

            {/* TipTap Gmail Editor */}
            <TipTap
              value={content}
              onChange={(val) => setValue('content', val, { shouldDirty: true })}
              onSend={handleSend}
              onDiscard={handleClose}
              onAttachClick={handleAttachClick}
              attachmentsCount={attachments.length}
            />

            {/* Hidden file input */}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* ATTACHMENT LIST */}
            {attachments.length > 0 && (
              <Box sx={styles.body.attachments.titleContainer}>
                <Typography variant="subtitle2" sx={styles.body.attachments.titleText}>
                  Tệp đính kèm ({attachments.length})
                </Typography>
                <Box sx={styles.body.attachments.list}>
                  {attachments.map((file, idx) => (
                    <Box key={`${file.name}-${idx}`} sx={styles.body.attachments.item}>
                      <Box sx={styles.body.attachments.itemContent}>
                        <AttachFileIcon sx={styles.body.attachments.icon} />
                        <Box>
                          <Typography variant="body2" sx={styles.body.attachments.name}>
                            {file.name}
                          </Typography>
                          <Typography variant="caption" sx={styles.body.attachments.size}>
                            {formatFileSize(file.size)}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={() => removeAttachment(idx)} sx={styles.body.attachments.closeBtn}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </FormProvider>
  );
};

export default EmailBox;