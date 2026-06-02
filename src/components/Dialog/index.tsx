import { Close } from '@mui/icons-material';
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import React from 'react';

interface DialogProps {
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
 }: DialogProps) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      sx={{ '& .MuiDialog-paper': { borderRadius: '8px', padding: 1, overlay: 'none'} }}
    >
      {title && <DialogTitle id="alert-dialog-title" sx={{ fontSize: '16px', fontWeight: 'bold' }}>{title}</DialogTitle>}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[100],
        })}
      >
        <Close />
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

