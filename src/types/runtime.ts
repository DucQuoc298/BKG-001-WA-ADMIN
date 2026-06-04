import { ComponentType } from 'react';

export interface RuntimePluginManifestItem {
  id: string;
  name: string;
  routePath: string;
  moduleUrl: string;
  enabled?: boolean;
}

export interface RuntimePluginManifest {
  plugins: RuntimePluginManifestItem[];
}

export interface AppRuntime {
  http: {
    get: <T = unknown>(url: string, config?: unknown) => Promise<T>;
    post: <T = unknown>(url: string, body?: unknown, config?: unknown) => Promise<T>;
    fetchJson: <T = unknown>(url: string, init?: RequestInit) => Promise<T>;
  };
  // homeApi: {
  //   getMenuByModule: (params: { module: string }, callback?: (data: any) => void) => Promise<any>;
  //   getRecent: (params: { operatorid: string }, callback?: (data: any) => void) => Promise<any>;
  //   updateRecent: (params: { menuid: string }, callback?: (data: any) => void) => Promise<any>;
  //   getLicenceInfo: (callback?: (data: any) => void) => Promise<any>;
  // };
  components: {
    Box: ComponentType<any>;
    Button: ComponentType<any>;
    Dialog: ComponentType<any>;
    MainCard: ComponentType<any>;
    Paper: ComponentType<any>;
    Stack: ComponentType<any>;
    Typography: ComponentType<any>;
  };
}

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
