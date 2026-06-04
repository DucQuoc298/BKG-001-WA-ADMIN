import { createContext, useContext } from "react";
import { AppRuntime } from "types";
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import {MainCard, Dialog, ContainerWrapper} from 'components';

const appRunTime: AppRuntime = {
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
    ContainerWrapper
  },
};

export const createAppRuntimeContext = () => {
  const AppRuntimeContext = createContext<AppRuntime | null>(null);

    const Provider = ({ children }: { children: React.ReactNode }) => {

      return <AppRuntimeContext.Provider value={appRunTime}>{children}</AppRuntimeContext.Provider>;
    };
    const useStore = () => {
      const ctx = useContext(AppRuntimeContext);
      if (!ctx) throw new Error("useAppRuntime must be used inside AppRuntimeContext.Provider");
      return ctx;
    };
    return { Provider, useStore };
}
