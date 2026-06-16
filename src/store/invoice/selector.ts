
import { createSelector } from "reselect";
import {
  IInvoiceState,
} from "store/invoice/reducer";

const selector = (state: { invoice: IInvoiceState }) => state.invoice;

const invoiceFormData = createSelector(selector, (invoice) => invoice?.form?.formData ?? { customerName: '', product: null });
const invoiceFormState = createSelector(
  selector,
  (invoice) => invoice?.form ?? { mode: 'create', activeId: null, loading: false, saving: false, error: null, message: null }
);
const invoiceListState = createSelector(
  selector,
  (invoice) => invoice?.list ?? { activeTab: 'all', searchKeyword: '', filters: {} }
);

export {
  invoiceFormData,
  invoiceFormState,
  invoiceListState,
};