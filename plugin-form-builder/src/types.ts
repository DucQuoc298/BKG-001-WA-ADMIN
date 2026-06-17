import type { JSX } from 'react';

// ── React (full module từ host) ──────────────────────────────
export type PluginReact = typeof import('react');

// ── UI Components ────────────────────────────────────────────
export type PluginUi = {
  Box: (props: any) => JSX.Element;
  Button: (props: any) => JSX.Element;
  Dialog: (props: any) => JSX.Element;
  MainCard: (props: any) => JSX.Element;
  Paper: (props: any) => JSX.Element;
  Stack: (props: any) => JSX.Element;
  Typography: (props: any) => JSX.Element;
  ContainerWrapper: (props: any) => JSX.Element;
  TextField: (props: any) => JSX.Element;
  NumberField: (props: any) => JSX.Element;
  DropDownList: (props: any) => JSX.Element;
  DateField: (props: any) => JSX.Element;
  DateRangeField: (props: any) => JSX.Element;
};

// ── Form API (react-hook-form từ host) ───────────────────────
export type PluginFormApi = {
  useForm: (options?: any) => any;
  FormProvider: (props: any) => JSX.Element;
  Controller: (props: any) => JSX.Element;
  useFormContext: () => any;
  useWatch: (options?: any) => any;
};

// ── Custom Hooks (từ host) ───────────────────────────────────
export type PluginHooksApi = {
  useReduxFormSync: <T extends Record<string, any>>(options: {
    methods: any;
    values?: any;
    onSave: (values: any) => void;
    enabled?: boolean;
    restoreDirtyFields?: boolean;
    saveDirtyFields?: boolean;
  }) => void;
};

// ── Plugin Store (scoped, không cần truyền pluginId) ─────────
export type PluginStoreApi = {
  useSelector: <T>(selector: (state: any) => T) => T;
  useDispatch: () => (action: any) => void;
  /** Lấy form state của plugin hiện tại (pluginId đã closure sẵn từ host) */
  getPluginFormState: () => any;
  /** Cập nhật form state của plugin hiện tại */
  updatePluginForm: (data: any) => void;
  /** Reset form state của plugin hiện tại */
  resetPluginForm: () => void;
};

// ── SDK tổng hợp ─────────────────────────────────────────────
export type PluginSdk = {
  http: {
    get: <T = unknown>(url: string, config?: any) => Promise<T>;
    post: <T = unknown>(url: string, body?: any, config?: any) => Promise<T>;
    fetchJson: <T = unknown>(url: string, init?: RequestInit) => Promise<T>;
  };
  components: PluginUi;
  broadcast?: {
    postMessage: <T = any>(type: string, payload?: T) => void;
    subscribe: (callback: (message: any) => void) => () => void;
  };
  form: PluginFormApi;
  hooks: PluginHooksApi;
  store: PluginStoreApi;
};

// ── Plugin Context & definePlugin ────────────────────────────
export type PluginComponent = () => JSX.Element;

export type PluginContext = {
  react: PluginReact;
  sdk: PluginSdk;
};

export const definePlugin = (factory: (context: PluginContext) => PluginComponent) => factory;
