import { AppRuntime } from 'runtime/types';
import demoFormRuntime from 'runtime/types/default';
import invoiceFormRuntime from 'runtime/types/invoice';

const runtimeDeclarations = [demoFormRuntime, invoiceFormRuntime] as const;

const runtimeRegistry: Record<string, AppRuntime> = runtimeDeclarations.reduce<Record<string, AppRuntime>>((acc, declaration) => {
  acc[declaration.id] = declaration.runtime;
  return acc;
}, {});

const fallbackRuntime = demoFormRuntime.runtime;

export const createAppRuntime = (id?: string): AppRuntime => {
  if (!id) {
    return fallbackRuntime;
  }

  return runtimeRegistry[id] ?? fallbackRuntime;
};
