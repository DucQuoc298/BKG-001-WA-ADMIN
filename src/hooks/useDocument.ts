import { useDispatch, useSelector } from "react-redux";
import {
  error,
  loading,
  message,
} from "store/document/selector"
import { addLinkRequest, attachFileRequest } from "store/document/reducer";
import { IAttachFile, IFile } from "types";
export function useDocument() {
  const dispatch = useDispatch();   
  const documentError  = useSelector(error);
  const documentLoading = useSelector(loading);
  const documentMessage = useSelector(message);

  const attachFile = (params: { comments: string;  linkto: string; referencekey1: string;
        file: IFile; }, onSuccess?: (data: IAttachFile[]) => void) => {
    dispatch(attachFileRequest({ params, onSuccess }));
  }
  const addLink = (params: { autonum: string; category: string; comments: string; documentcode: string; filename: string; linkto: string; referencekey1: string; subject: string }, onSuccess?: (data: any) => void) => {
    dispatch(addLinkRequest({ params, onSuccess }));
   }


  return {
    documentError,
    documentLoading,
    documentMessage,
    attachFile,
    addLink,
  };

}