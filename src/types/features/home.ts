

export interface IMenu {
  "id": string,
  "iconcls": string,
  "shortcmd": string,
  "text": string,
  "isshow": "Y" | "N",
  "xclass": string | null,
  "expanded": boolean,
  "isdefault": boolean,
  "leaf": boolean,
  "mappingField": string | null,
  "extendedField": string | null,
  "type": string | null,
  "children": IMenu[] | null,
  "grid": string | null,
  "store": string | null
}

export interface IRecentMenu {
  "tvcdb": string,
  "operatorid": string,
  "formlink": string,
  "tvcmodule": string,
  "formid": string,
  "lastentry": string
}
export interface ILicenseInfo {
  "companyName": string,
  "address": string,
  "phonenumber": string,
  "website": string,
  "contact": string,
  "contactphone": string,
  "users": number,
  "expired": string
}

export enum EModuleRoutes {
  "CR" = "cr",
  "FD" = "fd",
  "CS" = "cs",
  "LA" = "la",
  "DM" = "dm",
  "IF" = "if",
}