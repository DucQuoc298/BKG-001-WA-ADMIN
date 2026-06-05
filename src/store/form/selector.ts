import { createSelector } from "reselect";
import { FormDraftState } from "./reducer";

const selector = (state: { form: FormDraftState }) => state.form;
const getInvoiceForm = createSelector(selector, ({ invoiceForm }: FormDraftState) => invoiceForm);
const getHomeForm = createSelector(selector, ({ homeForm }: FormDraftState) => homeForm);
export {
  getInvoiceForm,
  getHomeForm
};