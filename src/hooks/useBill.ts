import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  billFormData,
  billFormState,
  billListState,
} from "store/bill/selector";
import { BillFilters, BillFormData, openBillForm, resetBillForm, resetBillList, setBillFormLoading, setBillFormSaving, updateBillForm, updateBillListFilters, updateBillListSearch, updateBillListTab } from "store/bill/reducer";
import { EFormMode } from "types";

export const useBill = () => {
  const dispatch = useDispatch();

  // Selectors
  const billForm = useSelector(billFormData);
  const formState = useSelector(billFormState);
  const listState = useSelector(billListState);

  // Form actions
  const update = useCallback(
    (data: Partial<BillFormData>) => {
      dispatch(updateBillForm(data));
    },
    [dispatch]
  );

  const openForm = useCallback(
    (mode: EFormMode, activeId?: string | number | null, data?: BillFormData) => {
      dispatch(openBillForm({ mode, activeId, data }));
    },
    [dispatch]
  );

  const resetForm = useCallback(() => {
    dispatch(resetBillForm());
  }, [dispatch]);

  const setSaving = useCallback(
    (saving: boolean) => {
      dispatch(setBillFormSaving(saving));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setBillFormLoading(loading));
    },
    [dispatch]
  );

  // List actions
  const updateTab = useCallback(
    (tab: string) => {
      dispatch(updateBillListTab(tab));
    },
    [dispatch]
  );

  const updateSearch = useCallback(
    (search: string) => {
      dispatch(updateBillListSearch(search));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (filters: Partial<BillFilters>) => {
      dispatch(updateBillListFilters(filters));
    },
    [dispatch]
  );

  const resetList = useCallback(() => {
    dispatch(resetBillList());
  }, [dispatch]);

  return {
    // State
    billForm,
    formState,
    listState,

    // Actions
    update, // Giữ nguyên tên update để tương thích ngược
    updateForm: update,
    openForm,
    resetForm,
    setSaving,
    setLoading,
    updateTab,
    updateSearch,
    updateFilters,
    resetList,
  };
};