import { createSlice } from "@reduxjs/toolkit";
import {INotification } from "types";

export interface ISnackbarState {
  message: string;
  type?: "success" | "info" | "warning" | "error";
  options?: IOptions;
  notificationBadgeCount?: number;
  notificationBadge?: INotification[];
  loading?: boolean;
  total?: number;
  error?: any;
  saving?: boolean;
  langOpts?: {
    [key: string]: string;
  };
}
interface IOptions {
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  autoHideDuration?: number;
  useI18n?: boolean;
}

const initialState: ISnackbarState = {
  message: "",
  type: "info",
  options: {
    position: {
      horizontal: "center",
      vertical: "top",
    },
    autoHideDuration: 2000,
    useI18n: false,
  },
  notificationBadgeCount: 0,
  notificationBadge: undefined,
  loading: false,
  error: null,
  total: 0,
  saving: false,
  langOpts: {},
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
   
    show: (state, { payload }: { payload: ISnackbarState }) => {
      return {
        ...state,
        message: payload.message,
        type: payload.type || "info",
        langOpts: payload.langOpts,
        options: {
          ...state.options,
          useI18n: !!payload?.options?.useI18n,
        },
      };
    },
    info: (state, { payload }: { payload: ISnackbarState }) => {
      return {
        ...state,
        message: payload.message,
        langOpts: payload.langOpts,
        type: "info",
        options: {
          ...state.options,
          useI18n: !!payload?.options?.useI18n,
        },
      };
    },
    success: (state, { payload }: { payload: ISnackbarState }) => {
      return {
        ...state,
        message: payload.message,
        langOpts: payload.langOpts,
        type: "success",
        options: {
          ...state.options,
          useI18n: !!payload?.options?.useI18n,
        },
      };
    },
    warning: (state, { payload }: { payload: ISnackbarState }) => {
      return {
        ...state,
        message: payload.message,
        langOpts: payload.langOpts,
        type: "warning",
        options: {
          ...state.options,
          useI18n: !!payload?.options?.useI18n,
        },
      };
    },
    error: (
      state,
      {
        payload,
      }: { payload: { message: string; options?: IOptions; langOpts?: any } }
    ) => {
      return {
        ...state,
        message: payload.message,
        langOpts: payload.langOpts,
        type: "error",
        options: {
          ...state.options,
          useI18n: !!payload?.options?.useI18n,
        },
      };
    },
    hide: (state) => {
      return {
        ...state,
        message: "",
      };
    },

    getUnReadRequest: (
      state,
      _data: { payload: { onSuccess?: (data: any) => void } }
    ) => {
      return { ...state, loading: true };
    },
    readRequest: (
      state,
      _data: { payload: { id: string; onSuccess?: (data: any) => void } }
    ) => {
      return { ...state, saving: true };
    },
    delRequest: (
      state,
      _data: { payload: { id: string; onSuccess?: (data: any) => void } }
    ) => {
      return { ...state, saving: true };
    },
    getCountSuccess: (state, { payload }: { payload: { data: number } }) => {
      return { ...state, loading: false, notificationBadgeCount: payload.data };
    },
    getSuccess: (
      state,
      { payload }: { payload: { data: INotification[]; total: number } }
    ) => ({
      ...state,
      notificationBadge: payload.data,
      error: null,
      message: "",
      loading: false,
      total: payload.total,
    }),
    requestFailure: (state, { payload }) => ({
      ...state,
      saving: false,
      error: `${payload}`,
      message: "",
      loading: false,
    }),
    requestSuccess: (state, _data: { payload }) => ({
      ...state,
      saving: false,
      error: null,
      loading: false,
    }),
  }
});
const { actions, reducer } = snackbarSlice;
const {
  show,
  info,
  success,
  warning,
  error,
  hide,
  getUnReadRequest,
  readRequest,
  delRequest,
  getCountSuccess,
  getSuccess,
  requestFailure,
  requestSuccess,
} = actions;
export {
  show,
  info,
  success,
  warning,
  error,
  hide,
  getUnReadRequest,
  readRequest,
  delRequest,
  getCountSuccess,
  getSuccess,
  requestFailure,
  requestSuccess,
}
export default reducer;