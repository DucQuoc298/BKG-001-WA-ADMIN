import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InvoiceFormData, updateInvoiceForm } from "store/invoice/reducer";
import { invoiceFormData } from "store/invoice/selector";


export const useInvoice = () => {
  const dispatch = useDispatch();
  const invoiceForm = useSelector(invoiceFormData);

  const update = useCallback(
    (data: Partial<InvoiceFormData>) => {
      dispatch(updateInvoiceForm(data));
    },
    [dispatch]
  );

  return { invoiceForm, update };
}