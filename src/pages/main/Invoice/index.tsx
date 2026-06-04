import { Box, Container, Grid, Typography } from '@mui/material';
import ContainerWrapper from 'components/ContainerWrapper';
import MainCard from 'components/MainCard';
import React from 'react';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function Invoice() {

  return (
    <ContainerWrapper>
      <MainCard >
        <Typography variant="h4" gutterBottom>
          Invoice Page
        </Typography>
        <Typography variant="body1">
          This is the invoice page content.
        </Typography>
      </MainCard>
    </ContainerWrapper>
  );
}
