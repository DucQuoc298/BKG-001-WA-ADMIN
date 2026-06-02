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