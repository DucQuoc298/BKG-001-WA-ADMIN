import { createStorageContext } from "contexts/ConfigContext";
import { createAppRuntimeContext } from "runtime/AppRuntimeContext";
export const {
  Provider: AuthProvider,
  useStore: useAuth
} = createStorageContext();

export const {
  Provider: MainProvider,
  useStore: useMain
} = createStorageContext();

export const {
  Provider: AppRuntimeProvider,
  useStore: useAppRuntime
} = createAppRuntimeContext();
