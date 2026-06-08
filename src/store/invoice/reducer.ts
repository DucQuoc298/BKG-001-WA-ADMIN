
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type InvoiceFormData = {
  customerName: string;
  product?: string | null;
}
export interface IInvoiceState {
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
  formData: InvoiceFormData;
}
const initialState: IInvoiceState = {
  loading: false,
  saving: false,
  error: null,
  message: null,
  formData: {
    customerName: '',
    product: null,
  },
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    updateInvoiceForm: (state, action: PayloadAction<Partial<InvoiceFormData>>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
    resetInvoiceForm: (state) => {
      state.formData = initialState.formData;
    },
  }
});

export const { updateInvoiceForm, resetInvoiceForm } = invoiceSlice.actions;
export default invoiceSlice.reducer;