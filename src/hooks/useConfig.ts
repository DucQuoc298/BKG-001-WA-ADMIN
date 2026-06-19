import { createStorageContext } from "contexts/Configcontext";
export const {
  Provider: AuthProvider,
  useStore: useAuth
} = createStorageContext();

export const {
  Provider: MainProvider,
  useStore: useMain
} = createStorageContext();
