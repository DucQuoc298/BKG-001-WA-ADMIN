// material-ui
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import React from 'react';
// project imports
import MainCard from 'components/Card/MainCard';

// assets
import avatar from 'assets/images/users/avatar-group.png';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

export default function NavCard() {
  return (
    <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
      <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
        <CardMedia component="img" image={avatar} sx={{ width: 112 }} />


      </Stack>
    </MainCard>
  );
}
