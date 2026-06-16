import { configureStore } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";

import { persistReducer } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import appReducer from "./";
import rootSaga from "./rootSaga";
import { listenerMiddleware } from './listenerMiddleware'
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["app"],
};

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware, listenerMiddleware.middleware];

const persistedReducer = persistReducer(persistConfig, appReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(middleware),
});
// const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
