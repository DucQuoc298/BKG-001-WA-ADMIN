
import { createSelector } from "reselect";
import {
  IBillState,
} from "store/bill/reducer";

const selector = (state: { bill: IBillState }) => state.bill;

const billFormData = createSelector(selector, (bill) => bill?.form?.formData ?? { customerName: '', product: null });
const billFormState = createSelector(
  selector,
  (bill) => bill?.form ?? { mode: 'create', activeId: null, loading: false, saving: false, error: null, message: null }
);
const billListState = createSelector(
  selector,
  (bill) => bill?.list ?? { activeTab: 'all', searchKeyword: '', filters: {} }
);

export {
  billFormData,
  billFormState,
  billListState,
};