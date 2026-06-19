import { createSelector } from "reselect";
import { IDocumentState } from "./reducer";

const selector = (state: { document: IDocumentState }) => state.document;
const error = createSelector(selector, ({ error }: IDocumentState) => error);
const loading = createSelector(selector, ({ loading }: IDocumentState) => loading);
const message = createSelector(selector, ({ message }: IDocumentState) => message);
const record = createSelector(selector, ({ record }: IDocumentState) => record);  

export {
  error,
  loading,
  message,
  record,
};