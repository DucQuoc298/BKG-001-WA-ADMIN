import { createSelector } from "reselect";
import { ILoginState } from "./reducer";

const selector = (state: { authentication: ILoginState }) => state.authentication;
const error = createSelector(selector, ({ error }: ILoginState) => error);
const loading = createSelector(selector, ({ loading }: ILoginState) => loading);
const message = createSelector(selector, ({ message }: ILoginState) => message);
const record = createSelector(selector, ({ record }: ILoginState) => record);
const license = createSelector(selector, ({ license }: ILoginState) => license);
const confirmCode = createSelector(selector, ({ confirmCode }: ILoginState) => confirmCode);
const companyList = createSelector(selector, ({ companyList }: ILoginState) => companyList);
export {
  error,
  loading,
  message,
  record,
  license,
  confirmCode,
  companyList
};