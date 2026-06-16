import { createSlice } from "@reduxjs/toolkit";
import { ICompany, ILicense, IUser } from "types";

interface ILoginState {
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
  record: IUser | null;
  license: ILicense[] | null;
  confirmCode: string | null;
  companyList?: ICompany[];
}

const initialState: ILoginState = {
  loading: false,
  saving: false,
  error: null,
  message: null,
  record: null,
  license: null,
  confirmCode: null,
  companyList: [],
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    loginRequest: (state, _data: {payload: {params: {username: string, password: string}, onSuccess?: (data: IUser)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    loginSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: payload,
      loading: false,
      record: payload.data
    }),
    logoutRequest: (state, _data: {payload: {onSuccess?: (data: any)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    logoutSuccess: (state, _data: {payload: {onSuccess?: (data: any)=>void}}) => ({
      ...state,
      saving: false,
      error: null,
      message: null,
      loading: false,
      record: null,
      license: null
    }),
    forgotPasswordRequest: (state, _data: {payload: {params: {userid: string, email: string}, onSuccess?: (data: any)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    forgotPasswordSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: null,
      loading: false,
      confirmCode: payload.data.confirmCode
    }),
    confirmForgotPasswordRequest: (state, _data: {payload: {params: {confirmCode: string, verificationCode: string}, onSuccess?: (data: any)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    confirmForgotPasswordSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: payload.message,
      record: payload.data,
      loading: false,
    }),
    resetPasswordRequest: (state, _data: {payload: {params: {confirmCode: string, newPassword: string, verifyCode: string}, onSuccess?: (data: any)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    updatePasswordRequest: (state, _data: {payload: {params: {oldPassword: string, newPassword: string}, onSuccess?: (data: any)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    updatePasswordSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: payload.message,
      loading: false,
    }),
    getLicenseInfoRequest: (state, _data: {payload: {params: any, onSuccess?: (data: ILicense[])=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    getConfigRequest: (state, _data: {payload: {params: any, onSuccess?: (data: IUser)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    getConfigSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: null,
      loading: false,
      record: payload.data
    }),
    getLicenseInfoSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: null,
      loading: false,
      license: payload.data
    }),
    registerLicenseRequest: (state, _data: {payload: {params: {code: string, company: string, expiryDate: string}, onSuccess?: (data: any)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    registerLicenseSuccess: (state, { payload }) => ({ 
      ...state,
      saving: false,
      error: null,
      message: payload.message,
      loading: false,
    }),
    changeCompanyRequest: (state, _data: {payload: {params: {cpnId: string}, onSuccess?: (data: any)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    changeCompanySuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      record: payload.data,
    }),
    getCompanyListRequest: (state, _data: {payload: {onSuccess?: (data: any)=>void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    getCompanyListSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: null,
      loading: false,
      companyList: payload.data
    }),
    syncSuccess: (state, { payload }) => ({
      ...state,
      saving: false,
      error: null,
      message: payload,
      loading: false,
    }),
    requestFailure: (state, { payload }) => ({
      ...state,
      saving: false,
      error: payload,
      message: null,
      loading: false,
    }),
  }
});
const { actions, reducer } = authenticationSlice;
const {
  loginRequest,
  loginSuccess,
  getConfigRequest,
  getConfigSuccess,
  getLicenseInfoRequest,
  getLicenseInfoSuccess,
  logoutRequest,
  logoutSuccess,
  syncSuccess,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  confirmForgotPasswordRequest,
  confirmForgotPasswordSuccess,
  resetPasswordRequest,
  registerLicenseRequest,
  registerLicenseSuccess,
  updatePasswordRequest,
  updatePasswordSuccess,
  changeCompanyRequest,
  changeCompanySuccess,
  getCompanyListRequest,
  getCompanyListSuccess,
  requestFailure
} = actions;
export {
  loginRequest,
  loginSuccess,
  getConfigRequest,
  getConfigSuccess,
  getLicenseInfoRequest,
  getLicenseInfoSuccess,
  logoutRequest,
  logoutSuccess,
  syncSuccess,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  confirmForgotPasswordRequest,
  confirmForgotPasswordSuccess,
  registerLicenseRequest,
  registerLicenseSuccess,
  updatePasswordRequest,
  updatePasswordSuccess,
  resetPasswordRequest,
  changeCompanyRequest,
  changeCompanySuccess,
  getCompanyListRequest,
  getCompanyListSuccess,
  requestFailure
}
export type { ILoginState };
export default reducer;