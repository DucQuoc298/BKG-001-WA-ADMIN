import { Box } from "@mui/system";
import React, { useRef } from "react";
import createStyles from './styles';
import { IconButton, InputBase, Typography, useTheme } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { useFormContext } from 'react-hook-form';
import TipTap from "./TipTap";
import { EmailFormFields } from 'store/email/reducer';

interface IEmailBoxProps {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
  isComposerOpen: boolean;
  setIsComposerOpen: (value: boolean) => void;
  onSend: () => void;
  onDiscard: () => void;
}

const EmailBox = ({
  isMinimized,
  setIsMinimized,
  setIsComposerOpen,
  onDiscard,
  onSend
}: IEmailBoxProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, watch, setValue, formState: { errors } } = useFormContext<EmailFormFields>();

  // Lấy các giá trị hiện tại của form thông qua watch
  const content = watch('content');
  const showCc = watch('showCc');
  const showBcc = watch('showBcc');
  const attachments = watch('attachments') ?? [];

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

  return (
    <Box sx={{ ...styles.container, height: isMinimized ? '44px' : 'auto' }}>
      {/* HEADER */}
      <Box
        onClick={() => setIsMinimized(!isMinimized)}
        sx={{ ...styles.header.container, borderBottom: isMinimized ? 'none' : `1px solid ${theme.palette.grey['200']}` }}
      >
        <Typography variant="subtitle2" sx={styles.header.title}>
          Thư mới
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
          <IconButton size="small" onClick={() => setIsMinimized(!isMinimized)} sx={styles.header.btn}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setIsComposerOpen(false)} sx={styles.header.btn}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* COMPOSER BODY */}
      {!isMinimized && (
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
            onSend={onSend}
            onDiscard={onDiscard}
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
  );
};

export default EmailBox;