import { useLocalStorage } from 'hooks';
import React, { createContext, useContext, useMemo } from 'react';
type ConfigContextValue = {
  state: any;
  setState: (value: any) => void;
  setField: (key: any, value: any) => void;
  resetState: () => void;
};
export const createStorageContext = () => {
  const Context = createContext<ConfigContextValue | null>(null);

  const Provider = ({ storageKey, initialState, children }: { storageKey: string; initialState: any; children: React.ReactNode }) => {
    const store = useLocalStorage(storageKey, initialState);

    const value = useMemo(() => store, [store.state]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useStore = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error('Hook must be used inside Provider');
    return ctx;
  };

  return { Provider, useStore };
};
