import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type InvoiceFormData = {
  customerName: string;
  phone: string;
  note: string;
};
type HomeFormData = {
    note: string;
};
export type FormDraftState = {
  invoiceForm: InvoiceFormData;
  homeForm: HomeFormData;
};
interface IOptions {
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  autoHideDuration?: number;
  useI18n?: boolean;
}

const initialState: FormDraftState = {
  invoiceForm: {
    customerName: "",
    phone: "",
    note: "",
  },
  homeForm: {
    note: "",
  }
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateInvoiceForm: (
      state,
      action: PayloadAction<Partial<InvoiceFormData>>
    ) => {
      state.invoiceForm = {
        ...state.invoiceForm,
        ...action.payload,
      };
    },
    updateHomeForm: (
      state,
      action: PayloadAction<Partial<HomeFormData>>
    ) => {
      state.homeForm = {
        ...state.homeForm,
        ...action.payload,
      };
    },

    resetInvoiceForm: (state) => {
      state.invoiceForm = initialState.invoiceForm;
    },
  },
});
const { actions, reducer } = formSlice;
const {
  updateInvoiceForm,
  resetInvoiceForm,
  updateHomeForm
} = actions;
export {
  updateInvoiceForm,
  resetInvoiceForm,
  updateHomeForm
}
export default reducer;