import { IToolbarButton } from "./toolbarLocal";

export enum IThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

export enum ILanguage {
  EN = "EN",
  VN = "VN",
}

export interface IQueryParams {
  page: number;
  start: number;
  limit: number;
}

export interface IFile {
  data: string;
  filename: string;
  filetype: string;
}

export interface IAttachFile {
  "autonum": string,
  "documentcode": string,
  "filename": string,
  "category": string,
  "comments": string
}

export enum IAction {
  NEW = "new",
  EDIT = "edit",
  DELETE = "delete",
  VIEW = "view",
  CANCEL = "cancel",
  MORE = "more",
}
export interface IActionAndSub {
  key: IAction;
  sub: string;
}

export const actionButtons: IToolbarButton[] = [
  {
    key: IAction.NEW,
    icon: "plus",
  },
  {
    key: IAction.EDIT,
    icon: "edit",
  },
  {
    key: IAction.DELETE,
    icon: "delete",
  },
  {
    key: IAction.VIEW,
    icon: "eye",
  },
  {
    key: IAction.CANCEL,
    icon: "close",
  },


];