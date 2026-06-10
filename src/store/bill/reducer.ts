
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EFormMode } from 'types/form';

export type BillFormData = {
  customerName: string;
  product?: any;
};

export type BillFilters = {
  startDate?: string;
  endDate?: string;
  customerId?: string;
};


export interface ListState<TFilters = Record<string, any>> {
  activeTab: string;
  searchKeyword: string;
  filters: TFilters;
}

export interface FormState<TFormData> {
  mode: EFormMode;
  activeId: string | number | null;
  formData: TFormData;
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
}

export interface IBillState {
  list: ListState<BillFilters>;
  form: FormState<BillFormData>;
}

const initialState: IBillState = {
  list: {
    activeTab: 'all',
    searchKeyword: '',
    filters: {},
  },
  form: {
    mode: EFormMode.LIST,
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

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    // Actions cho trang List
    updateBillListTab: (state, action: PayloadAction<string>) => {
      state.list.activeTab = action.payload;
    },
    updateBillListSearch: (state, action: PayloadAction<string>) => {
      state.list.searchKeyword = action.payload;
    },
    updateBillListFilters: (state, action: PayloadAction<Partial<BillFilters>>) => {
      state.list.filters = {
        ...state.list.filters,
        ...action.payload,
      };
    },
    updateBillList: (state, action: PayloadAction<Partial<ListState<BillFilters>>>) => {
      state.list = {
        ...state.list,
        ...action.payload,
      };
    },
    resetBillList: (state) => {
      state.list = initialState.list;
    },

    // Actions cho trang Form
    openBillForm: (
      state,
      action: PayloadAction<{ mode: EFormMode; activeId?: string | number | null; data?: BillFormData }>
    ) => {
      state.form.mode = action.payload.mode;
      state.form.activeId = action.payload.activeId ?? null;
      if (action.payload.data) {
        state.form.formData = action.payload.data;
      } else if (action.payload.mode === EFormMode.FORM) {
        state.form.formData = initialState.form.formData;
      }
    },
    updateBillForm: (state, action: PayloadAction<Partial<BillFormData>>) => {
      state.form.formData = {
        ...state.form.formData,
        ...action.payload,
      };
    },
    setBillFormSaving: (state, action: PayloadAction<boolean>) => {
      state.form.saving = action.payload;
    },
    setBillFormLoading: (state, action: PayloadAction<boolean>) => {
      state.form.loading = action.payload;
    },
    resetBillForm: (state) => {
      state.form = initialState.form;
    },
  },
});

export const {
  updateBillListTab,
  updateBillListSearch,
  updateBillListFilters,
  resetBillList,
  openBillForm,
  updateBillForm,
  setBillFormSaving,
  setBillFormLoading,
  resetBillForm,
} = billSlice.actions;

export default billSlice.reducer;