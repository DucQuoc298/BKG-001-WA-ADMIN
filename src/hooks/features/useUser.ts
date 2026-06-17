import { useDispatch, useSelector } from "react-redux";
import {
  getLicenseInfoRequest,
  getConfigRequest,
  loginRequest,
  logoutRequest,
  forgotPasswordRequest,
  confirmForgotPasswordRequest,
  resetPasswordRequest,
  updatePasswordRequest,
  registerLicenseRequest,
  changeCompanyRequest,
  getCompanyListRequest
} from "store/authentication/reducer"
import {
  error,
  license,
  loading,
  message,
  record,
  confirmCode,
  companyList
} from "store/authentication/selector"
import { IUser, ILicense } from "types";

export function useUser() {
  const dispatch = useDispatch();
  const authError = useSelector(error);
  const authLoading = useSelector(loading);
  const authMessage = useSelector(message);
  const user = useSelector(record);
  const authLicense = useSelector(license);
  const authConfirmCode = useSelector(confirmCode);
  const listCompany = useSelector(companyList);

  const login = (params: { username: string; password: string, captcha?: string }, onSuccess?: (data: IUser) => void) => {
    dispatch(loginRequest({ params, onSuccess }));
  };
  const getConfig = (params: { accessToken: string, captcha?: string }, onSuccess?: (data: IUser) => void) => {
    dispatch(getConfigRequest({ params, onSuccess }));
  };
  const getLicenseInfo = (params: any, onSuccess?: (data: ILicense[]) => void) => {
    dispatch(getLicenseInfoRequest({ params, onSuccess }));
  };
  const logout = (onSuccess?: (data: any) => void) => {
    dispatch(logoutRequest({ onSuccess }));
  }
  const forgotPassword = (params: { userid: string, email: string, captcha?: string }, onSuccess?: (data: any) => void) => {
    dispatch(forgotPasswordRequest({ params, onSuccess }));
  }
  const confirmForgotPassword = (params: { confirmCode: string, verificationCode: string }, onSuccess?: (data: any) => void) => {
    dispatch(confirmForgotPasswordRequest({ params, onSuccess }));
  }
  const resetPassword = (params: { confirmCode: string, newPassword: string, verifyCode: string, captcha?: string }, onSuccess?: (data: any) => void) => {
    dispatch(resetPasswordRequest({ params, onSuccess }));
  }
  const updatePassword = (params: { oldPassword: string, newPassword: string }, onSuccess?: (data: any) => void) => {
    dispatch(updatePasswordRequest({ params, onSuccess }));
  }
  const registerLicense = (params: { code: string, company: string, expiryDate: string }, onSuccess?: (data: any) => void) => {
    dispatch(registerLicenseRequest({ params, onSuccess }));
  }
  const changeCompany = (params: { cpnId: string }, onSuccess?: (data: any) => void) => {
    dispatch(changeCompanyRequest({ params, onSuccess }));
  }
  const getCompanyList = (onSuccess?: (data: any) => void) => {
    dispatch(getCompanyListRequest({ onSuccess }));
  }

  return {
    login,
    getConfig,
    getLicenseInfo,
    authError,
    authLoading,
    authMessage,
    user,
    authLicense,
    authConfirmCode,
    listCompany,
    logout,
    forgotPassword,
    confirmForgotPassword,
    resetPassword,
    updatePassword,
    registerLicense,
    changeCompany,
    getCompanyList,

  };
}