import { JSX } from 'react';

export type PluginSdk = {
  http: {
    fetchJson: <T = unknown>(url: string, init?: RequestInit) => Promise<T>;
  };
  homeApi: {
    getLicenceInfo: (callback?: (data: unknown) => void) => Promise<unknown>;
  };
  components: PluginUi;
};

export type PluginUi = {
  Box: (props: any) => JSX.Element;
  Button: (props: any) => JSX.Element;
  Dialog: (props: any) => JSX.Element;
  MainCard: (props: any) => JSX.Element;
  Paper: (props: any) => JSX.Element;
  Stack: (props: any) => JSX.Element;
  Typography: (props: any) => JSX.Element;
  ContainerWrapper: (props: any) => JSX.Element;
};

export type PluginReact = Pick<typeof import('react'), 'Fragment' | 'createElement' | 'useState'>;

export type PluginComponent = () => JSX.Element;

export type PluginContext = {
  react: PluginReact;
  sdk: PluginSdk;
};

export const definePlugin = (factory: (context: PluginContext) => PluginComponent) => factory;
