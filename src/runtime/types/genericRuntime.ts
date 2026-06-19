import { Box, Paper, Stack, Typography } from '@mui/material';
import {
  Button, Dialog, MainCard, ContainerWrapper,
  TextField, NumberField, DropDownList,
  DateField, DateRangeField,
} from 'components';
import { useForm, FormProvider, Controller, useFormContext, useWatch } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useReduxFormSync } from 'hooks';
import { createSafeBroadcastChannel, postBroadcastMessage } from 'services';
import { store } from 'store/createStore';
import { updatePluginForm, resetPluginForm } from 'store/pluginForms/reducer';
import type { AppRuntime } from '.';

/**
 * Tạo runtime generic cho 1 plugin cụ thể.
 *
 * `pluginId` được closure vào các hàm `store.*` →
 * plugin không cần biết id của mình, chỉ gọi `sdk.store.updatePluginForm(data)`.
 *
 * File này là **nguồn duy nhất** tạo runtime cho mọi plugin.
 * Không cần tạo file runtime riêng cho từng plugin/khách hàng.
 */
export const createGenericRuntime = (pluginId: string): AppRuntime => ({
  // ── HTTP Client ─────────────────────────────────────────────
  http: {
    get: async <T = unknown>(url: string, config?: unknown) => {
      console.log(`[${pluginId}] GET ${url}`, config);
      const res = await fetch(url);
      return res.json() as Promise<T>;
    },
    post: async <T = unknown>(url: string, body?: unknown, config?: unknown) => {
      console.log(`[${pluginId}] POST ${url}`, body, config);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return res.json() as Promise<T>;
    },
    fetchJson: async <T = unknown>(url: string, init?: RequestInit) => {
      const res = await fetch(url, init);
      return res.json() as Promise<T>;
    },
  },

  // ── Shared Components (MUI + Custom) ────────────────────────
  components: {
    Box,
    Button,
    Dialog,
    MainCard,
    Paper,
    Stack,
    Typography,
    ContainerWrapper,
    TextField,
    NumberField,
    DropDownList,
    DateField,
    DateRangeField,
  },

  // ── Broadcast Channel ───────────────────────────────────────
  broadcast: {
    postMessage: (type: string, payload?: any) => {
      postBroadcastMessage(type, payload);
    },
    subscribe: (callback: (message: any) => void) => {
      const channel = createSafeBroadcastChannel();
      if (!channel) return () => {};

      const handler = (event: MessageEvent) => {
        callback(event.data);
      };
      channel.addEventListener('message', handler);
      return () => {
        channel.removeEventListener('message', handler);
        try {
          channel.close();
        } catch {
          // ignore close errors
        }
      };
    },
  },

  // ── Form API (react-hook-form) ──────────────────────────────
  form: {
    useForm,
    FormProvider,
    Controller,
    useFormContext,
    useWatch,
  },

  // ── Custom Hooks ────────────────────────────────────────────
  hooks: {
    useReduxFormSync,
  },

  // ── Plugin Store (scoped by pluginId) ───────────────────────
  store: {
    useSelector,
    useDispatch,

    /** Lấy form state — pluginId đã được closure */
    getPluginFormState: () => {
      const state = store.getState() as any;
      return state?.pluginForms?.forms?.[pluginId] ?? null;
    },

    /** Cập nhật form state — pluginId đã được closure */
    updatePluginForm: (data: any) => {
      store.dispatch(updatePluginForm({ pluginId, data }));
    },

    /** Reset form state — pluginId đã được closure */
    resetPluginForm: () => {
      store.dispatch(resetPluginForm(pluginId));
    },
  },
});
