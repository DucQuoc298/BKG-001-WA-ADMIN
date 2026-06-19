import MaintenanceWrapper from "sections/maintenance/Maintenancewrapper";
import React from "react";
import Error500Image from 'assets/images/maintenance/Error500.png';
import styles from './styles';
import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Error500 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <MaintenanceWrapper>
      <Stack>
        <img src={Error500Image} alt="500 Error" style={styles.image} />
      </Stack>
      <Stack direction={"column"} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Typography variant="h1" sx={{ ...styles.title }}>{t('maintenance.500.title')}</Typography>
        <Typography variant="body1" sx={{ ...styles.body }}>{t('maintenance.500.message')}</Typography>
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

export default Error500;