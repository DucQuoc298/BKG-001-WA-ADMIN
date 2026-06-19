import { all, takeLatest } from "redux-saga/effects";
import {
  loginRequest,
  requestFailure,
  syncSuccess,
  getLicenseInfoRequest,
  getLicenseInfoSuccess,
  getConfigRequest,
  getConfigSuccess,
  loginSuccess,
  logoutSuccess,
  logoutRequest,
  forgotPasswordRequest,
  confirmForgotPasswordRequest,
  forgotPasswordSuccess,
  confirmForgotPasswordSuccess,
  resetPasswordRequest,
  updatePasswordSuccess,
  updatePasswordRequest,
  registerLicenseSuccess,
  registerLicenseRequest,
  getCompanyListSuccess,
  getCompanyListRequest,
  changeCompanyRequest,
  changeCompanySuccess,
} from "./reducer"
import {
  login as loginApi,
  getConfig as getConfigApi,
  getLicenseInfo as getLicenseInfoApi,
  logout as logoutApi,
  forgotPassword as forgotPasswordApi,
  confirmForgotPassword as confirmForgotPasswordApi,
  resetPassword as resetPasswordApi,
  updatePassword as updatePasswordApi,
  registerLicense as registerLicenseApi,
  changeCompany,
  getcompanyList
} from "services/api/authorization";
import { request } from "store/utils";
import { ILicense, IUser } from "types";

function* loginAction({ payload }: { payload: { params: any, onSuccess?: (data: IUser) => void } }) {
  yield* request({
    service: loginApi,
    params: payload.params,
    successAction: loginSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}

function* getConfigAction({ payload }: { payload: { params: any, onSuccess?: (data: IUser) => void } }) {
  yield* request({
    service: getConfigApi,
    params: payload.params,
    successAction: getConfigSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}

function* getLicenseInfoAction({ payload }: { payload: { params: any, onSuccess?: (data: ILicense[]) => void } }) {
  yield* request({
    service: getLicenseInfoApi,
    params: payload.params,
    successAction: getLicenseInfoSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}

function* logoutAction({ payload }: { payload: { onSuccess?: (data: any) => void } }) {
  yield* request({
    service: logoutApi,
    successAction: logoutSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}
function* forgotPasswordAction({ payload }: { payload: { params: { userid: string, email: string }, onSuccess?: (data: any) => void } }) {
  yield* request({
    service: forgotPasswordApi,
    params: payload.params,
    successAction: forgotPasswordSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}
function* confirmForgotPasswordAction({ payload }: { payload: { params: { confirmCode: string, verificationCode: string }, onSuccess?: (data: any) => void } }) {
  yield* request({
    service: confirmForgotPasswordApi,
    params: payload.params,
    successAction: confirmForgotPasswordSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}
function* resetPasswordAction({ payload }: { payload: { params: { confirmCode: string, newPassword: string, verifyCode: string }, onSuccess?: (data: any) => void } }) {
  yield* request({
    service: resetPasswordApi,
    params: payload.params,
    successAction: syncSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}
function* updatePasswordAction({ payload }: { payload: { params: { oldPassword: string, newPassword: string }, onSuccess?: (data: any) => void } }) {
  yield* request({
    service: updatePasswordApi,
    params: payload.params,
    successAction: updatePasswordSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}
function* registerLicenseAction({ payload }: { payload: { params: { code: string, company: string, expiryDate: string }, onSuccess?: (data: any) => void } }) {
  yield* request({
    service: registerLicenseApi,
    params: payload.params,
    successAction: registerLicenseSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}
function* changeCompanyAction({ payload }: { payload: { params: { cpnId: string }, onSuccess?: (data: any) => void } }) {
  yield* request({
    service: changeCompany,
    params: payload.params,
    successAction: changeCompanySuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}
function* getCompanyListAction({ payload }: { payload: { onSuccess?: (data: any) => void } }) {
  yield* request({
    service: getcompanyList,
    successAction: getCompanyListSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}
export default function* sagas() {
  yield all([
    takeLatest(loginRequest, loginAction),
    takeLatest(getConfigRequest, getConfigAction),
    takeLatest(getLicenseInfoRequest, getLicenseInfoAction),
    takeLatest(logoutRequest, logoutAction),
    takeLatest(forgotPasswordRequest, forgotPasswordAction),
    takeLatest(confirmForgotPasswordRequest, confirmForgotPasswordAction),
    takeLatest(resetPasswordRequest, resetPasswordAction),
    takeLatest(updatePasswordRequest, updatePasswordAction),
    takeLatest(registerLicenseRequest, registerLicenseAction),
    takeLatest(changeCompanyRequest, changeCompanyAction),
    takeLatest(getCompanyListRequest, getCompanyListAction),
  ]);
}