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

export interface RuntimeBaseRule extends RuntimeHttpClient, RuntimeSharedComponents {}

export type AppRuntime<TExtra extends object = object> = RuntimeBaseRule & TExtra;

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
