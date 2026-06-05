// material-ui
import Box from '@mui/material/Box';

// project imports
import Profile from './Profile';
import Notification from './Notification';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IFormKey } from 'types/form';
import { MainNameRoutes } from 'types';
import { useTranslation } from 'react-i18next';
// ==============================|| HEADER - CONTENT ||============================== //

type OpenedFormTab = {
  path: MainNameRoutes | string;
  label: IFormKey;
};

const getTabLabel = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments.length > 0 ? segments[segments.length - 1] : import.meta.env.VITE_BASE_URL || '/';
  return lastSegment;
};

export default function HeaderContent() {
  const location = useLocation();
  const [openedFormTabs, setOpenedFormTabs] = useState<OpenedFormTab[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const nextTab: OpenedFormTab = {
      path: location.pathname,
      label: getTabLabel(location.pathname) as IFormKey,
    };

    setOpenedFormTabs((prevTabs) => {
      if (prevTabs.some((tab) => tab.path === nextTab.path)) {
        return prevTabs;
      }
      return [...prevTabs, nextTab];
    });
  }, [ location.pathname, t]);

  const sortedOpenedTabs = useMemo(() => openedFormTabs, [openedFormTabs, t]);

  return (
    <>
      <Box sx={{height: 50, display: 'flex', width: '100%', bgcolor: 'red'}} >
        {sortedOpenedTabs.map((tab) => (
          <Box key={tab.path} sx={{ px: 2, py: 1, bgcolor: location.pathname === tab.path ? 'primary.main' : 'grey.300', color: location.pathname === tab.path ? 'primary.contrastText' : 'text.primary', borderRadius: 1 }}>
            {t(`form.${tab.label.toUpperCase()}` as keyof typeof t)}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 2 }}>
        <Notification />
        <Profile />
      </Box>
    </>
  );
}
