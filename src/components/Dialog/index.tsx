import { Close } from '@mui/icons-material';
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions, IconButton, DialogProps as MuiDialogProps } from '@mui/material';
import Icons, { IconName } from 'assets/Icon';
import React from 'react';

interface DialogProps extends MuiDialogProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  action?: React.ReactNode;
}
const Dialog = ({
  open,
  title,
  onClose,
  ariaLabelledBy,
  ariaDescribedBy,
  children,
  action,
  sx,
  ...props
}: DialogProps) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      sx={{ '& .MuiDialog-paper': { borderRadius: '8px', padding: 1, "--Paper-overlay": 'none !important' }, ...sx }}
      {...props}
    >
      {title && <DialogTitle id="alert-dialog-title" sx={{ fontSize: '16px', fontWeight: 'bold' }}>{title}</DialogTitle>}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: "text.primary"
        }}
      >
        <Icons name={IconName.CLOSE} size={18} />
      </IconButton>
      <DialogContent dividers>
        {children}
      </DialogContent>
      {action && <DialogActions>
        {action}
      </DialogActions>}
    </MuiDialog>
  );
};

export default Dialog;
