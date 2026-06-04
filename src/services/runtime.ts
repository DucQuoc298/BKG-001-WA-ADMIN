import * as React from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import Dialog from 'components/Dialog';
import MainCard from 'components/MainCard';
// import { getLicenceInfo, getMenuByModule, getRecent, updateRecent } from 'services/api/home';
// import { axiosClient } from 'services/utils/axios';
import {
  RuntimePluginManifest,
  RuntimePluginManifestItem,
  RuntimePluginModule,
  AppRuntime,
} from 'types/runtime';

const DEFAULT_MANIFEST_PATH = 'plugins/manifest.json';

const normalizePath = (path: string) => {
  if (!path) return '/';
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
};

const getManifestUrl = () => {
  const fromEnv = import.meta.env.VITE_PLUGIN_MANIFEST_URL;
  const runtimeBase = window.location.origin + import.meta.env.BASE_URL;

  if (fromEnv) {
    return new URL(fromEnv, runtimeBase).toString();
  }
  return new URL(DEFAULT_MANIFEST_PATH, runtimeBase).toString();
};

export const getRuntimePluginManifest = async (): Promise<{ manifestUrl: string; plugins: RuntimePluginManifestItem[] }> => {
  const manifestUrl = getManifestUrl();
  const response = await fetch(manifestUrl, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Cannot load plugin manifest: ${response.status}`);
  }

  const data = (await response.json()) as RuntimePluginManifest;
  const plugins = Array.isArray(data.plugins) ? data.plugins.filter((item) => item.enabled !== false) : [];

  return { manifestUrl, plugins };
};

export const findPluginByPath = (plugins: RuntimePluginManifestItem[], pathname: string) => {
  const normalizedPathname = normalizePath(pathname);
  return plugins.find((item) => normalizePath(item.routePath) === normalizedPathname);
};

const resolvePluginModuleUrl = (manifestUrl: string, moduleUrl: string) => {
  return new URL(moduleUrl, manifestUrl).toString();
};

const createRuntimePluginSdk = (): AppRuntime => {
  return {
    http: {
      get: async <T = unknown>(url: string, config?: unknown) => {
        // const response = await axiosClient.get<T>(url, config as any);
        // return response.data;
        return {} as T;
      },
      post: async <T = unknown>(url: string, body?: unknown, config?: unknown) => {
        // const response = await axiosClient.post<T>(url, body, config as any);
        // return response.data;
        return {} as T;
      },
      fetchJson: async <T = unknown>(url: string, init?: RequestInit) => {
        // const response = await fetch(url, init);
        // if (!response.ok) {
        //   throw new Error(`Request failed with status ${response.status}`);
        // }
        // return (await response.json()) as T;
        return {} as T;
      },
    },
    // homeApi: {
      // getMenuByModule,
      // getRecent,
      // updateRecent,
      // getLicenceInfo,
    // },
    components: {
      Box,
      Button,
      Dialog,
      MainCard,
      Paper,
      Stack,
      Typography,
    },
  };
};

export const loadRuntimePluginComponent = async (
  plugin: RuntimePluginManifestItem,
  manifestUrl: string
): Promise<React.ComponentType> => {
  const sdk = createRuntimePluginSdk();
  const resolvedModuleUrl = resolvePluginModuleUrl(manifestUrl, plugin.moduleUrl);
  const pluginModule = (await import(/* @vite-ignore */ resolvedModuleUrl)) as RuntimePluginModule;

  if (pluginModule.default && typeof pluginModule.default === 'function') {
    return pluginModule.default;
  }

  if (pluginModule.createPluginComponent && typeof pluginModule.createPluginComponent === 'function') {
    const createComponent = pluginModule.createPluginComponent as (...args: any[]) => React.ComponentType | undefined;

    const fromContext = createComponent({ react: React, sdk });
    if (typeof fromContext === 'function') {
      return fromContext;
    }

    const fromLegacyArgs = createComponent(React, sdk);
    if (typeof fromLegacyArgs === 'function') {
      return fromLegacyArgs;
    }
  }

  throw new Error(`Plugin ${plugin.id} has no valid exported component`);
};
