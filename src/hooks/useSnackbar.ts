import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ISnackbarState, show as showActions, hide as hideActions } from "store/snackbar/reducer";
import {
  getLoading,
  getMessage,
  getType,
  getOptions,
  getLangOpts,
  getNotificationBadgeCount,
  getNotificationBadge
} from "store/snackbar/selector";
export const useSnackbar = () => {
  const dispatch = useDispatch();
  const message = useSelector(getMessage);
  const type = useSelector(getType);
  const options = useSelector(getOptions);
  const langOpts = useSelector(getLangOpts);
  const notificationBadgeCount = useSelector(getNotificationBadgeCount);
  const notificationBadge = useSelector(getNotificationBadge);
  const loading = useSelector(getLoading);

  const show = useCallback(({ type, message, options, langOpts }: ISnackbarState) => {
    dispatch(showActions({ type, message, options, langOpts }));
  }, [dispatch]);
  const info = useCallback(
    (message: string, options?: Partial<ISnackbarState["options"]>) =>
      show({ type: "info", message, options }),
    [show]
  );

  const success = useCallback(
    (message: string, options?: Partial<ISnackbarState["options"]>) =>
      show({ type: "success", message, options }),
    [show]
  );

  const error = useCallback(
    (message: string, options?: Partial<ISnackbarState["options"]>) =>
      show({ type: "error", message, options }),
    [show]
  );

  const warning = useCallback(
    (message: string, options?: Partial<ISnackbarState["options"]>) =>
      show({ type: "warning", message, options }),
    [show]
  );
  const hide = useCallback(() => dispatch(hideActions()), []);
  return { show, info, success, error, warning, hide, message, type, options, langOpts, notificationBadgeCount, notificationBadge, loading };
};