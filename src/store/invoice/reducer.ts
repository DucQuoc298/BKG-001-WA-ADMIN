
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type InvoiceFormData = {
  customerName: string;
  product?: any;
};

export type InvoiceFilters = {
  startDate?: string;
  endDate?: string;
  customerId?: string;
};

export type FormMode = 'create' | 'edit' | 'view';

export interface ListState<TFilters = Record<string, any>> {
  activeTab: string;
  searchKeyword: string;
  filters: TFilters;
}

export interface FormState<TFormData> {
  mode: FormMode;
  activeId: string | number | null;
  formData: TFormData;
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
}

export interface IInvoiceState {
  list: ListState<InvoiceFilters>;
  form: FormState<InvoiceFormData>;
}

const initialState: IInvoiceState = {
  list: {
    activeTab: 'view',
    searchKeyword: '',
    filters: {},
  },
  form: {
    mode: 'create',
    activeId: null,
    formData: {
      customerName: '',
      product: null,
    },
    loading: false,
    saving: false,
    error: null,
    message: null,
  },
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    // Actions cho trang List
    updateInvoiceListTab: (state, action: PayloadAction<string>) => {
      state.list.activeTab = action.payload;
    },
    updateInvoiceListSearch: (state, action: PayloadAction<string>) => {
      state.list.searchKeyword = action.payload;
    },
    updateInvoiceListFilters: (state, action: PayloadAction<Partial<InvoiceFilters>>) => {
      state.list.filters = {
        ...state.list.filters,
        ...action.payload,
      };
    },
    resetInvoiceList: (state) => {
      state.list = initialState.list;
    },

    // Actions cho trang Form
    openInvoiceForm: (
      state,
      action: PayloadAction<{ mode: FormMode; activeId?: string | number | null; data?: InvoiceFormData }>
    ) => {
      state.form.mode = action.payload.mode;
      state.form.activeId = action.payload.activeId ?? null;
      if (action.payload.data) {
        state.form.formData = action.payload.data;
      } else if (action.payload.mode === 'create') {
        state.form.formData = initialState.form.formData;
      }
    },
    updateInvoiceForm: (state, action: PayloadAction<Partial<InvoiceFormData>>) => {
      state.form.formData = {
        ...state.form.formData,
        ...action.payload,
      };
    },
    setInvoiceFormSaving: (state, action: PayloadAction<boolean>) => {
      state.form.saving = action.payload;
    },
    setInvoiceFormLoading: (state, action: PayloadAction<boolean>) => {
      state.form.loading = action.payload;
    },
    // resetInvoiceForm: Bắt buộc tuân thủ quy ước tự động reset form của useFormActions
    resetInvoiceForm: (state) => {
      state.form = initialState.form;
    },
  },
});

export const {
  updateInvoiceListTab,
  updateInvoiceListSearch,
  updateInvoiceListFilters,
  resetInvoiceList,
  openInvoiceForm,
  updateInvoiceForm,
  setInvoiceFormSaving,
  setInvoiceFormLoading,
  resetInvoiceForm,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;