import MaintenanceWrapper from "sections/maintenance/Maintenancewrapper";
import React from "react";
import Error404Image from 'assets/images/maintenance/Error404.png';
import styles from './styles';
import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <MaintenanceWrapper>
      <Stack>
        <img src={Error404Image} alt="404 Error" style={styles.image} />
      </Stack>
      <Stack direction={"column"} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Typography variant="h1" sx={{ ...styles.title }}>{t('maintenance.404.title')}</Typography>
        <Typography variant="body1" sx={{ ...styles.body }}>{t('maintenance.404.message')}</Typography>
        <Button
          variant="contained"
          sx={{ ...styles.button }}
          onClick={() => navigate('/')}
        >
          {t('maintenance.button.back_to_home')}
        </Button>
      </Stack>
    </MaintenanceWrapper>
  )
}

export default Error404;