import { createSelector } from "reselect";
import { ISnackbarState} from "./reducer";

const selector = (state: { snackbar: ISnackbarState }) => state.snackbar;
const getError = createSelector(selector, ({ error }: ISnackbarState) => error);
const getLoading = createSelector(selector, ({ loading }: ISnackbarState) => loading);
const getMessage = createSelector(selector, ({ message }: ISnackbarState) => message);
const getType = createSelector(selector, ({ type }: ISnackbarState) => type);
const getOptions = createSelector(selector, ({ options }: ISnackbarState) => options);
const getLangOpts = createSelector(selector, ({ langOpts }: ISnackbarState) => langOpts);
const getNotificationBadgeCount = createSelector(selector, ({ notificationBadgeCount }: ISnackbarState) => notificationBadgeCount);
const getNotificationBadge = createSelector(selector, ({ notificationBadge }: ISnackbarState) => notificationBadge);

export {
  getError,
  getLoading,
  getMessage,
  getType,
  getOptions,
  getLangOpts,
  getNotificationBadgeCount,
  getNotificationBadge
};