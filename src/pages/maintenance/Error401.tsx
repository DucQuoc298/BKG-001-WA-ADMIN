import MaintenanceWrapper from "sections/maintenance/MaintenanceWrapper";
import React from "react";
import Error401Image from 'assets/images/maintenance/Error401.png';
import styles from './styles';
import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Error401 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <MaintenanceWrapper>
      <Stack>
        <img src={Error401Image} alt="401 Error" style={styles.image} />
      </Stack>
      <Stack direction={"column"} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <Typography variant="h1" sx={{ ...styles.title }}>{t('maintenance.401.title')}</Typography>
        <Typography variant="body1" sx={{ ...styles.body }}>{t('maintenance.401.message')}</Typography>
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

export default Error401;