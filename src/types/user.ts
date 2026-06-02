export interface IUser {
  "login": boolean,
  "weak": boolean,
  "ledger": string,
  "company": string,
  "operatorid": string,
  "employee": string,
  "nadcode": string,
  "prospect": string,
  "orgchartposition": string,
  "token": string,
  "refreshToken": string,
  "warehouse": string,
  "roleid": string,
  "operatorname": string,
  "homepage": string,
  "crhomepage": string,
  "hrhomepage": string,
  "erplitehomepage": string,
  "dateformat": string,
  "language": string,
  "email": string,
  "operations": string,
  "debug": string,
  "title": string,
  "tabname": string,
  "langVersion": string,
  "lastmodule": string,
  "homepages": {
      "IF": string,
  }
}

export interface ICompany {
  "tvcdb": string,
  "tvcdbname": string,
  "roleid": string,
  "rolename": string,
  "status": string,
  "operatorid": string
}