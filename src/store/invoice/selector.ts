
import { createSelector } from "reselect";
import { 
  IInvoiceState,
} from "store/invoice/reducer";

const selector = (state: { invoice: IInvoiceState }) => state.invoice;

const invoiceFormData = createSelector( selector, ({formData}) => formData );


export {
  invoiceFormData
};