import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useAppRuntime } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  findPluginByPath,
  getRuntimePluginManifest,
  loadRuntimePluginComponent,
} from 'services/runtime';
import { AppRuntime, RuntimePluginManifestItem, RuntimePluginModule } from 'types';

type RuntimeStatus = 'loading' | 'ready' | 'error';

export default function PluginRuntime() {
  const { pathname } = useLocation();
  const [status, setStatus] = useState<RuntimeStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [PluginPage, setPluginPage] = useState<React.ComponentType | null>(null);
  const sdk = useAppRuntime();
  const pluginUrl = `/plugins/${pathname}.mjs`;

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
        
        const component = await loadRuntimePluginComponent(plugin, manifestUrl, sdk);
        setPluginPage(() => component);
        setStatus('ready');
      } catch (error) {
        console.error('Error loading plugin:', error);
        setErrorMessage((error as Error).message || 'Unknown error');
        setStatus('error');
      }
    };

    loadPlugin();
  }, [pluginUrl]);

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
