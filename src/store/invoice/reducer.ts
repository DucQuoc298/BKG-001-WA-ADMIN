
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFormKey } from 'types';
export type InvoiceFormData = {
  customerName: string;
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
  },
};

const invoiceSlice = createSlice({
  name: IFormKey.INVOICE.toLowerCase(),
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