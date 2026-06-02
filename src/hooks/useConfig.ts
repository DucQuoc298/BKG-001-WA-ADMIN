import { createStorageContext } from "contexts/ConfigContext";

export const {
  Provider: AuthProvider,
  useStore: useAuth
} = createStorageContext();

export const {
  Provider: MainProvider,
  useStore: useMain
} = createStorageContext();