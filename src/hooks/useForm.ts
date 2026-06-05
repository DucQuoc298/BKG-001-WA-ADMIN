import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    FormDraftState,
    updateInvoiceForm,
    updateHomeForm,
    resetInvoiceForm
} from "store/form/reducer";
import { getHomeForm, getInvoiceForm } from "store/form/selector";

export const useForm = () => {
  const dispatch = useDispatch();
  const invoiceForm = useSelector(getInvoiceForm);
  const homeForm = useSelector(getHomeForm);

  const update = useCallback(
    (key: string, data: Partial<FormDraftState[keyof FormDraftState]>) => {
      if (key === "invoiceForm") {
        dispatch(updateInvoiceForm(data));
      } else if (key === "homeForm") {
        dispatch(updateHomeForm(data));
      }
    },
    [dispatch]
  );
    const reset = useCallback(() => {   
    dispatch(resetInvoiceForm());
  }, [dispatch]);

  return { invoiceForm, homeForm, update, reset };
}
