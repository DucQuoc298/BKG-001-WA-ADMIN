import { ICompany, IFile } from "types";
import {
  formPost,
  handlePost,
} from "../utils/utils";


const login = (data: { username: string, password: string, captcha?: string }, callback?: (data: any) => void) => {
  return handlePost("", {
    "action": "ConnectDB",
    "method": "getConfig",
    "tid": 2,
    "type": "rpc",
    "data": [{
      id: 1,
      username: data.username,
      password: data.password,
      captcha: data.captcha || import.meta.env.VITE_CAPTCHA_SITE_KEY,
    }]
  }, callback);
}
const refreshToken = async (refreshToken: string) => {
  try {
    const res = await handlePost('', {
      "action": "ConnectDB",
      "method": "refreshToken",
      "data": [
        {
          "refreshToken": refreshToken
        }
      ]
    });
    return res;
  } catch (error) {
    console.error('refreshToken error:', error);
    throw new Error('There was something wrong');
  }
};
const getConfig = async (params: { accessToken: string, captcha?: string }, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "ConnectDB",
    "method": "getConfig",
    "data": [
      {
        id: 0,
        captcha: params.captcha || import.meta.env.VITE_CAPTCHA_SITE_KEY,
        accessToken: params.accessToken
      },
    ],
    type: 'rpc',
    tid: 1,
  }, callback);
};
const getLicenseInfo = async (accessToken: string, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "ConnectDB",
    "method": "getLicenseInfor",
    "data": [{}],
    type: 'rpc',
    tid: 3,
  }, callback);
};
const getInformationRegister = async (
  params: { company: string; expiryDate: string },
  callback?: (data: any) => void,
) => {
  const formData = new FormData();
  formData.append("extAction", "ConnectDB");
  formData.append("extMethod", "getInformation");
  formData.append("extDownLoad", "true");
  formData.append("company", params.company);
  formData.append("expiryDate", params.expiryDate);

  return formPost("/directRouter/form", formData, callback, {
    responseType: "blob",
  });
};

const logout = async (callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "ConnectDB",
    "method": "getConfig",
    "data": [{ id: 2 }],
    type: 'rpc',
    tid: 7,
  }, callback);
};

const checkSession = async (callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "ConnectDB",
    "method": "checkSession",
    "data": [{}],
    type: 'rpc',
    tid: 5,
  }, callback);
};

const forgotPassword = async (data: { userid: string, email: string, captcha?: string }, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "ConnectDB",
    "method": "forgotPwd",
    "data": [
      {
        userid: data.userid,
        email: data.email,
        captcha: data.captcha || import.meta.env.VITE_CAPTCHA_SITE_KEY,
      },
    ],
    type: 'rpc',
    tid: 4,
  }, callback);
};
const confirmForgotPassword = async (data: { confirmCode: string, verificationCode: string }, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "ConnectDB",
    "method": "confirmForgotPwd",
    "data": [
      {
        confirmCode: data.confirmCode,
        verifyCode: data.verificationCode,
      },
    ],
    type: 'rpc',
    tid: 4,
  }, callback);
};
const resetPassword = async (data: { confirmCode: string, newPassword: string, verifyCode: string, captcha?: string }, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "ConnectDB",
    "method": "changePwd",
    "data": [
      {
        captcha: data.captcha || import.meta.env.VITE_CAPTCHA_SITE_KEY,
        confirmCode: data.confirmCode,
        newPwd: data.newPassword,
        verifyCode: data.verifyCode,
      },
    ],
    type: 'rpc',
    tid: 4,
  }, callback);
};
const updatePassword = async (data: { oldPassword: string, newPassword: string }, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "FrmCsOperator",
    "method": "updPwd",
    "data": [
      {
        OLD_PASS: data.oldPassword,
        NEW_PASS: data.newPassword,
      },
    ],
    type: 'rpc',
    tid: 4,
  }, callback);
};
const registerLicense = async (data: { code: string, company: string, expiryDate: string }, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "ConnectDB",
    "method": "regLicense",
    "data": [
      data
    ],
    type: 'rpc',
    tid: 4,
  }, callback);
};
const addLink = async (data: {
  autonumber: string,
  category: string,
  comments: string,
  documentcode: string,
  filename: string,
  linkto: string,
  referencekey1: string,
  subject: string
}, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "FrmFdDocument",
    "method": "addLink",
    "data": [data],
    type: 'rpc',
    tid: 4,
  }, callback);
};
const attachFile = async (data: {
  comments: string,
  linkto: string,
  referencekey1: string,
  file: IFile,
}, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "FrmFdDocument",
    "method": "attach",
    "data": [data],
    type: 'rpc',
    tid: 4,
  }, callback);
};
const getcompanyList = async (callback?: (data: ICompany[]) => void) => {
  return handlePost('', {
    "action": "FrmCsOperator",
    "method": "getCpnList",
    "data": [{}],
    type: 'rpc',
    tid: 4,
  }, callback);
};
const changeCompany = async (params: { cpnId: string }, callback?: (data: any) => void) => {
  return handlePost('', {
    "action": "ConnectDB",
    "method": "changeCpn",
    "data": [{
      db: params.cpnId
    }],
    type: 'rpc',
    tid: 4,
  }, callback);
};

export {
  login,
  refreshToken,
  getConfig,
  getLicenseInfo,
  getInformationRegister,
  logout,
  checkSession,
  forgotPassword,
  confirmForgotPassword,
  resetPassword,
  updatePassword,
  registerLicense,
  addLink,
  attachFile,
  getcompanyList,
  changeCompany,
}