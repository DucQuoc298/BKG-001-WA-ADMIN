/** @format */

import { all } from "redux-saga/effects";
import authenticationSaga from "store/authentication/sagas";
import documentSagas from "store/document/sagas";

export default function* rootSaga() {
  yield all([
    authenticationSaga(),

  ]);
}
