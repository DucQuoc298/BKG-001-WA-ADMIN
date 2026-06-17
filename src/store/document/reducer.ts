import { createSlice } from "@reduxjs/toolkit";
import { IAttachFile, IFile } from "types";

interface IDocumentState {
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
  record: IAttachFile[] | null;
}

const initialState: IDocumentState = {
  loading: false,
  saving: false,
  error: null,
  message: null,
  record: null,
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    attachFileRequest: (state, _data: {payload: { params: { comments: string; linkto: string; referencekey1: string; file: IFile;}, onSuccess?: (data: IAttachFile[]) => void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    attachFileSuccess: (state, { payload }: { payload: { data: IAttachFile[] | null } }) => ({
      ...state,
      loading: false,
      error: null,
      message: null,
      record: payload.data,
    }),
    addLinkRequest: (state, _data: {payload: { params: { autonum: string; category: string; comments: string; documentcode: string; filename: string; linkto: string; referencekey1: string; subject: string; }, onSuccess?: (data: IAttachFile[]) => void}}) => ({
      ...state,
      loading: true,
      error: null,
      message: null,
    }),
    addLinkSuccess: (state, { payload }: { payload: { data: IAttachFile[] | null } }) => ({
      ...state,
      loading: false,
      error: null,
      message: null,
      record: payload.data,
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
const { actions, reducer } = documentSlice;
const {
  syncSuccess,
  requestFailure,
  attachFileRequest,
  attachFileSuccess,
  addLinkRequest,
  addLinkSuccess
} = actions;
export {
  syncSuccess,
  requestFailure,
  attachFileRequest,
  attachFileSuccess,
  addLinkRequest,
  addLinkSuccess
}
export type { IDocumentState };
export default reducer;