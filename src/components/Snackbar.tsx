
import React from 'react';
import MuiSnackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { useSnackbar } from 'hooks/useSnackbar';
const Snackbar = () => {
  const {type, message, hide} = useSnackbar();
  const handleClose = () => {
   hide();
  }

  return (
    <MuiSnackbar
      open={!!message}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
          onClose={handleClose}
          severity={type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
    </MuiSnackbar>
  );
}

export default Snackbar;