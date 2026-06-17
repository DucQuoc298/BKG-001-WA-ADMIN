import { all, takeLatest } from "redux-saga/effects";
import {
  requestFailure,
  attachFileRequest,
  attachFileSuccess,
  addLinkRequest,
  addLinkSuccess
} from "./reducer"
import { 
  attachFile,
  addLink
} from "services";
import { request } from "store/utils";
import { IAttachFile, IFile } from "types/document";

function* attachFileAction({payload}: {payload: {params: { 
    comments: string;
    linkto: string;
    referencekey1: string;
    file: IFile;
  }, onSuccess?: (data: IAttachFile[]) => void}}) {
  yield* request({
    service: attachFile,
    params: payload.params,
    successAction: attachFileSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
    })
  }
function* addLinkAction({payload}: {payload: {params: { 
    autonum: string;
    category: string;
    comments: string;
    documentcode: string;
    filename: string;
    linkto: string;
    referencekey1: string;
    subject: string;
  }, onSuccess?: (data: IAttachFile[]) => void}}) {
  const { autonum, ...rest } = payload.params;
  yield* request({
    service: addLink,
    params: {
      ...rest,
      autonumber: autonum,
    },
    successAction: addLinkSuccess,
    failureAction: requestFailure,
    onSuccess: payload.onSuccess
  })
}

export default function* sagas() {
  yield all([
    takeLatest(attachFileRequest, attachFileAction),
    takeLatest(addLinkRequest, addLinkAction),
  ]);
}