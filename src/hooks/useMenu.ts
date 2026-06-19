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
  openedForm: [],
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
      return { ...currentMenuMaster, openedForm: [newTab, ...openedForm] };
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
      const removedIndex = openedForm.findIndex((tab) => tab.path === path);
      const nextOpenedForm = openedForm.filter((tab) => tab.path !== path);

      if (removedIndex === -1) {
        return currentMenuMaster;
      }

      const isRemovingActiveTab = currentMenuMaster?.activeForm === openedForm[removedIndex]?.label?.toUpperCase();

      if (!isRemovingActiveTab) {
        return { ...currentMenuMaster, openedForm: nextOpenedForm };
      }

      const nextActiveTab =
        nextOpenedForm[removedIndex] ?? nextOpenedForm[removedIndex - 1] ?? nextOpenedForm[0];

      return {
        ...currentMenuMaster,
        openedForm: nextOpenedForm,
        activeForm: nextActiveTab ? nextActiveTab.label.toUpperCase() : 'HOME'
      };
    },
    false
  );
};
