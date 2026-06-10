import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  InvoiceFormData,
  InvoiceFilters,
  FormMode,
  updateInvoiceForm,
  openInvoiceForm,
  resetInvoiceForm,
  updateInvoiceListTab,
  updateInvoiceListSearch,
  updateInvoiceListFilters,
  resetInvoiceList,
  setInvoiceFormSaving,
  setInvoiceFormLoading,
} from "store/invoice/reducer";
import {
  invoiceFormData,
  invoiceFormState,
  invoiceListState,
} from "store/invoice/selector";

export const useInvoice = () => {
  const dispatch = useDispatch();

  // Selectors
  const invoiceForm = useSelector(invoiceFormData);
  const formState = useSelector(invoiceFormState);
  const listState = useSelector(invoiceListState);

  // Form actions
  const update = useCallback(
    (data: Partial<InvoiceFormData>) => {
      dispatch(updateInvoiceForm(data));
    },
    [dispatch]
  );

  const openForm = useCallback(
    (mode: FormMode, activeId?: string | number | null, data?: InvoiceFormData) => {
      dispatch(openInvoiceForm({ mode, activeId, data }));
    },
    [dispatch]
  );

  const resetForm = useCallback(() => {
    dispatch(resetInvoiceForm());
  }, [dispatch]);

  const setSaving = useCallback(
    (saving: boolean) => {
      dispatch(setInvoiceFormSaving(saving));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setInvoiceFormLoading(loading));
    },
    [dispatch]
  );

  // List actions
  const updateTab = useCallback(
    (tab: string) => {
      dispatch(updateInvoiceListTab(tab));
    },
    [dispatch]
  );

  const updateSearch = useCallback(
    (search: string) => {
      dispatch(updateInvoiceListSearch(search));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (filters: Partial<InvoiceFilters>) => {
      dispatch(updateInvoiceListFilters(filters));
    },
    [dispatch]
  );

  const resetList = useCallback(() => {
    dispatch(resetInvoiceList());
  }, [dispatch]);

  return {
    // State
    invoiceForm,
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