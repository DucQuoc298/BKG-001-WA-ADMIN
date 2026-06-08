import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
export type OpenedFormTab = {
  path: string;
  label: string;
};
interface MenuMaster {
  isDashboardDrawerOpened: boolean;
  selectedMenu: string;
  selectedCollapse: string;
  openedForm: OpenedFormTab[];
  activeForm: string;
}
const initialState: MenuMaster = {
  isDashboardDrawerOpened: false,
  selectedMenu: 'home',
  selectedCollapse: '',
  openedForm: [{ path: '/home', label: 'HOME' }],
  activeForm: 'HOME'
};

const endpoints = {
  key: 'api/menu',
  master: 'master',
  dashboard: '/dashboard' // server URL
};

export function useGetMenuMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerDrawerOpen(isDashboardDrawerOpened: boolean) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}
export function handlerSelectedMenu(selectedMenu: string) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, selectedMenu };
    },
    false
  );
}
export function handlerSelectedCollapse(selectedCollapse: string) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, selectedCollapse };
    },
    false
  );
}
export function addOpenedFormTab(newTab: OpenedFormTab) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      const openedForm = currentMenuMaster?.openedForm || [];
      if (openedForm.some((tab) => tab.path === newTab.path)) {
        return currentMenuMaster;
      }
      return { ...currentMenuMaster, openedForm: [...openedForm, newTab] };
    },
    false
  );
}
export function handlerFormOpened(openedForm: OpenedFormTab[]) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, openedForm };
    },
    false
  );
};
export function handlerActiveForm(activeForm: string) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, activeForm };
    },
    false
  );
};
export function removeOpenedFormTab(path: string) {
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      const openedForm = currentMenuMaster?.openedForm || [];
      return { ...currentMenuMaster, openedForm: openedForm.filter((tab) => tab.path !== path) };
    },
    false
  );
};
