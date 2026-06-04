import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createAppRuntime } from 'runtime/AppPlugin';

import {
  findPluginByPath,
  getRuntimePluginManifest,
  loadRuntimePluginComponent,
} from 'runtime/services/runtime';

type RuntimeStatus = 'loading' | 'ready' | 'error';

export default function LoadFormRuntime() {
  const { pathname } = useLocation();
  const [status, setStatus] = useState<RuntimeStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [PluginPage, setPluginPage] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadPlugin = async () => {
      try {
        setStatus('loading');
        setErrorMessage('');
        setPluginPage(null);

        const { manifestUrl, plugins } = await getRuntimePluginManifest();
        const plugin = findPluginByPath(plugins, pathname);
        if (!plugin) {
          throw new Error(`No plugin found for route ${pathname}`);
        }
        
        const appRuntime = createAppRuntime(plugin.id);
        const component = await loadRuntimePluginComponent(plugin, manifestUrl, appRuntime);
        setPluginPage(() => component);
        setStatus('ready');
      } catch (error) {
        console.error('Error loading plugin:', error);
        setErrorMessage((error as Error).message || 'Unknown error');
        setStatus('error');
      }
    };

    loadPlugin();
  }, [pathname]);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography variant="h6">
          Loading plugin...
        </Typography>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Alert severity="error">Failed to load plugin: {errorMessage}</Alert>
      </Box>
    );
  } 
  if (!PluginPage) {
    return null;
  } 


  return <PluginPage />;
}
