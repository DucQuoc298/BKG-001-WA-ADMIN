import React from 'react';
import { Box, Typography } from '@mui/material';
import { Button, ContainerWrapper, EmailBox, MainCard } from 'components';
import { useSnackbar, useEmail, EmailFormFields } from 'hooks';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import CreateIcon from '@mui/icons-material/Create';

export default function Email() {
  const { success } = useSnackbar();
  const { composers, activeComposer, addComposer, removeComposer } = useEmail();

  // Trích xuất thông tin của composer đang hoạt động để phục vụ Xem trước (Live Preview)
  const activeData = activeComposer?.data;
  const recipient = activeData?.recipient || '';
  const cc = activeData?.cc || '';
  const bcc = activeData?.bcc || '';
  const showCc = activeData?.showCc || false;
  const showBcc = activeData?.showBcc || false;
  const subject = activeData?.subject || '';
  const content = activeData?.content || '';
  const attachments = activeData?.attachments || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCreateComposer = () => {
    const id = `composer-${Date.now()}`;
    addComposer(id);
  };

  const handleSend = (id: string, data: EmailFormFields) => {
    let successMessage = `Đã gửi email thành công tới ${data.recipient}!`;
    if (data.showCc && data.cc) successMessage += ` (Cc: ${data.cc})`;
    if (data.attachments && data.attachments.length > 0) {
      successMessage += ` (Đính kèm ${data.attachments.length} tệp)`;
    }
    success(successMessage);
    removeComposer(id);
  };

  const handleDiscard = (id: string) => {
    removeComposer(id);
    success('Đã hủy bản nháp email');
  };

  return (
    <ContainerWrapper toolbarLocalProps={{ title: 'Hộp thư' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr' },
          gap: 3,
        }}
      >
        {/* VIEW XEM TRƯỚC LIVE PREVIEW */}
        <Box>
          <MainCard title={activeComposer ? `Xem trước Email: ${subject || '(Không có tiêu đề)'}` : "Xem trước Email gửi đi"} border>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {!activeComposer && (
                <Box
                  sx={{
                    p: 4,
                    border: '1px dashed',
                    borderColor: 'primary.main',
                    borderRadius: '8px',
                    bgcolor: 'primary.lighter',
                    textAlign: 'center',
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <MailOutlineIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="subtitle1" color="primary.dark" sx={{ fontWeight: 600 }}>
                    Không có email nào đang soạn thảo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hãy bấm nút bên dưới để mở cửa sổ soạn thư mới ở góc phải màn hình. Bạn có thể soạn nhiều thư cùng lúc.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    text="Soạn thư mới"
                    startIcon={<CreateIcon fontSize="small" />}
                    onClick={handleCreateComposer}
                  />
                </Box>
              )}

              {activeComposer && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      text="Soạn thêm thư mới"
                      startIcon={<CreateIcon fontSize="small" />}
                      onClick={handleCreateComposer}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Đến:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                      {recipient || '(Chưa điền người nhận)'}
                    </Typography>
                  </Box>

                  {/* Preview Cc */}
                  {showCc && cc && (
                    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Cc:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                        {cc}
                      </Typography>
                    </Box>
                  )}

                  {/* Preview Bcc */}
                  {showBcc && bcc && (
                    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Bcc:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                        {bcc}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Tiêu đề:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {subject || '(Chưa điền tiêu đề)'}
                    </Typography>
                  </Box>

                  {/* Preview Attachments */}
                  {attachments.length > 0 && (
                    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Tệp đính kèm ({attachments.length}):
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {attachments.map((file, idx) => (
                          <Box
                            key={`preview-attach-${idx}`}
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              p: '4px 8px',
                              borderRadius: '16px',
                              border: '1px solid',
                              borderColor: 'divider',
                              bgcolor: 'action.hover',
                              fontSize: '11px',
                              fontWeight: 500,
                            }}
                          >
                            <AttachFileIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ fontSize: '11px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                              ({formatFileSize(file.size)})
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Nội dung thư:
                    </Typography>
                    <Box
                      className="ProseMirror"
                      sx={{
                        p: 2.5,
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: '8px',
                        minHeight: '250px',
                        maxHeight: '450px',
                        overflowY: 'auto',
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: 'text.primary',
                        '& h2': { fontSize: '1.4rem', fontWeight: 600, m: '0 0 10px 0' },
                        '& p': { m: '0 0 10px 0' },
                        '& ul': { pl: '20px', m: '0 0 10px 0' },
                        '& ol': { pl: '20px', m: '0 0 10px 0' },
                        '& li': { m: '0 0 4px 0' },
                        '& blockquote': {
                          borderLeft: '4px solid',
                          borderColor: 'primary.light',
                          pl: 2,
                          m: '0 0 10px 0',
                          fontStyle: 'italic',
                          color: 'text.secondary',
                        },
                        '& pre': {
                          background: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                          color: (theme) => theme.palette.mode === 'dark' ? '#d4d4d4' : '#333',
                          p: 1.5,
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          m: '0 0 10px 0',
                          overflowX: 'auto',
                        },
                        '& code': {
                          background: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                          color: 'primary.main',
                          px: 0.8,
                          py: 0.2,
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                        },
                      }}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </Box>
                </>
              )}
            </Box>
          </MainCard>
        </Box>
      </Box>

      {/* DOCK HIỂN THỊ CÁC CỬA SỔ SOẠN THẢO (FLOATcomposeDOCK) */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 80,
          display: 'flex',
          flexDirection: 'row-reverse',
          gap: 2,
          zIndex: 1000,
          alignItems: 'flex-end',
          pointerEvents: 'none', // Cho phép click xuyên qua các khoảng trống
          '& > *': {
            pointerEvents: 'auto', // Nhận sự kiện click cho từng cửa sổ composer
          }
        }}
      >
        {Object.values(composers)
          .filter((composer) => composer.id !== 'home-mailbox')
          .map((composer) => (
            <EmailBox
              key={composer.id}
              id={composer.id}
              onSend={handleSend}
              onDiscard={handleDiscard}
            />
          ))}
      </Box>
    </ContainerWrapper>
  );
}
