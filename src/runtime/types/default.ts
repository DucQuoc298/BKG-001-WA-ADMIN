
import { Box, Paper, Stack, Typography } from '@mui/material';
import { Button, Dialog, MainCard, ContainerWrapper } from 'components';
import { defineAppRuntime, defineFormRuntime } from '.';

const runtime = defineAppRuntime({
  http: {
    get: async <T = unknown>(url: string, config?: unknown) => {
      // Mock implementation of GET request
      console.log(`GET request to ${url} with config:`, config);
      return Promise.resolve({ data: 'Mock GET response' }) as Promise<T>;
    },
    post: async <T = unknown>(url: string, body?: unknown, config?: unknown) => {
      // Mock implementation of POST request
      console.log(`POST request to ${url} with body:`, body, 'and config:', config);
      return Promise.resolve({ data: 'Mock POST response' }) as Promise<T>;
    },
    fetchJson: async <T = unknown>(url: string, init?: RequestInit) => {
      // Mock implementation of fetchJson
      console.log(`fetchJson request to ${url} with init:`, init);
      return Promise.resolve({ data: 'Mock fetchJson response' }) as Promise<T>;
    },
  },
  components: {
    Box,
    Button,
    Dialog,
    MainCard,
    Paper,
    Stack,
    Typography,
    ContainerWrapper,
  },
});

export default defineFormRuntime('demo-form', runtime);