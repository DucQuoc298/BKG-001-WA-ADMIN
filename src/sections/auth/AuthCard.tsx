import PropTypes from 'prop-types';
import React from 'react';
// material-ui
import Box from '@mui/material/Box';
// project imports
import { MainCard } from 'components';
// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

export default function AuthCard({ children, ...other }) {
  return (
    <MainCard
      sx={{ maxWidth: 1000, '& > *': { flexGrow: 1, flexBasis: '50%' } }}
      content={false}
      {...other}
      border={false}
      boxshadow
    >
      <Box>{children}</Box>
    </MainCard>
  );
}

AuthCard.propTypes = { children: PropTypes.any, other: PropTypes.any };
