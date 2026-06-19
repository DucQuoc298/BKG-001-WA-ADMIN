import { ComponentType } from 'react';

export interface RuntimePluginManifestItem {
  id: string;
  name: string;
  routePath: string;
  moduleUrl: string;
  enabled?: boolean;
  icon?: string;
  sidebar?: boolean;
}

export interface RuntimePluginManifest {
  plugins: RuntimePluginManifestItem[];
}

export interface RuntimeHttpClient {
  http: {
    get: <T = unknown>(url: string, config?: unknown) => Promise<T>;
    post: <T = unknown>(url: string, body?: unknown, config?: unknown) => Promise<T>;
    fetchJson: <T = unknown>(url: string, init?: RequestInit) => Promise<T>;
  };
}

export interface RuntimeSharedComponents {
  components: object & { [key: string]: ComponentType<any> };
}

export interface RuntimeBroadcast {
  broadcast: {
    postMessage: <T = any>(type: string, payload?: T) => void;
    subscribe: (callback: (message: any) => void) => () => void;
  };
}

// ── Form API (react-hook-form) ──────────────────────────────
export interface RuntimeFormApi {
  useForm: (...args: any[]) => any;
  FormProvider: ComponentType<any>;
  Controller: ComponentType<any>;
  useFormContext: () => any;
  useWatch: (...args: any[]) => any;
}

// ── Custom Hooks ────────────────────────────────────────────
export interface RuntimeHooksApi {
  useReduxFormSync: (options: {
    methods: any;
    values?: any;
    onSave: (values: any) => void;
    enabled?: boolean;
    restoreDirtyFields?: boolean;
    saveDirtyFields?: boolean;
  }) => void;
}

// ── Plugin Store (scoped by pluginId) ───────────────────────
export interface RuntimePluginStoreApi {
  useSelector: <TResult = any>(selector: (state: any) => TResult) => TResult;
  useDispatch: () => any;
  /** Lấy form state của plugin hiện tại (pluginId đã closure sẵn) */
  getPluginFormState: () => any;
  /** Cập nhật form state của plugin hiện tại */
  updatePluginForm: (data: any) => void;
  /** Reset form state của plugin hiện tại */
  resetPluginForm: () => void;
}

// ── Plugin Extensions (form + hooks + store) ────────────────
export interface RuntimePluginExtensions {
  form: RuntimeFormApi;
  hooks: RuntimeHooksApi;
  store: RuntimePluginStoreApi;
}

export interface RuntimeBaseRule extends RuntimeHttpClient, RuntimeSharedComponents, RuntimeBroadcast {}

export type AppRuntime<TExtra extends object = object> = RuntimeBaseRule & RuntimePluginExtensions & TExtra;

export interface RuntimePluginContext {
  react: typeof import('react');
  sdk: AppRuntime;
}

export type RuntimePluginFactory =
  | ((context: RuntimePluginContext) => ComponentType)
  | ((react: typeof import('react'), sdk?: AppRuntime) => ComponentType);

export interface RuntimePluginModule {
  default?: ComponentType;
  createPluginComponent?: RuntimePluginFactory;
}

export interface RuntimeFormDeclaration<TExtra extends object = object> {
  id: string;
  runtime: AppRuntime<TExtra>;
}

export const defineAppRuntime = <TExtra extends object = object>(runtime: AppRuntime<TExtra>) => runtime;

export const defineFormRuntime = <TExtra extends object = object>(id: string, runtime: AppRuntime<TExtra>): RuntimeFormDeclaration<TExtra> => ({
  id,
  runtime,
});

export type AppRuntimeFactory = (pluginId?: string) => AppRuntime;

