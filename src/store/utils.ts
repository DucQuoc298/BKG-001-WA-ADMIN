import { ActionCreator } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
// import { useTranslation } from "react-i18next";
import { all, cancel, fork, put, take } from "redux-saga/effects";
import { error } from "store/snackbar/reducer";


const SUCCESS_STATUS = [200, 201, 202];
interface IGetRequest<TParam> {
  service: (data: TParam, callback?: (res) => void) => Promise<AxiosResponse>;
  params?: TParam;
  successAction: ActionCreator<any> | ActionCreator<any>[];
  failureAction: ActionCreator<any>;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
}
function* _request<TParam>({
  service,
  params,
  successAction,
  failureAction,
  onSuccess,
  onFailure,
}: IGetRequest<TParam>) {
  // const { t } = useTranslation();
  try {
    const rq: AxiosResponse = yield service(params!);
    if (!rq) {
      // TODO: Handle server communication error
    } else {
      const response = rq?.data;
      if (SUCCESS_STATUS.includes(rq?.status) && response) {
        if (response?.result.success) {
          if (Array.isArray(successAction)) {
            yield all(
              successAction.map((action) =>
                put(action({ ...response?.result, requestPayload: params }))
              )
            );
          } else
            yield put(
              successAction({ ...response?.result, requestPayload: params })
            );
          onSuccess && onSuccess(response?.result.data);
        } else {
          const response = rq?.data;
          if (SUCCESS_STATUS.includes(rq?.status) && response) {
            if (response?.result.success) {
              if (Array.isArray(successAction)) {
                yield all(
                  successAction.map((action) =>
                    put(
                      action({ ...response?.result, requestPayload: params })
                    )
                  )
                );
              } else
                yield put(
                  successAction({
                    ...response?.result,
                    requestPayload: params,
                  })
                );
              onSuccess && onSuccess(response?.result.data);
            } else {
              yield put(failureAction(response?.result.message));
              yield put(
                error({
                  message: response?.result.message,
                  options: { useI18n: true },
                  langOpts: response?.result.langOpts,
                })
              ); //t(`errors.${response?.message}`)
              onFailure && onFailure(response?.result.message);
            }
          } else {
            const message = response?.result.message || rq.status;

            yield put(failureAction(message));
            yield put(
              error({
                message,
                options: { useI18n: true },
                langOpts: response?.result.langOpts,
              })
            );
            onFailure && onFailure(message);
          }
        }
      } else {
        const rp = rq["response"]?.data;

        yield put(failureAction(rp?.message));
        yield put(
          error({
            message: rp?.message,
            options: { useI18n: true },
            langOpts: rp?.langOpts,
          })
        );
        onFailure && onFailure(rp?.message);
      }
    }
  } catch (e: any) {
    yield put(failureAction(e?.message));
    yield put(error({ message: e?.message }));
    onFailure && onFailure(e?.message);
  }
}
type ICancelRequest<TParam> = { cancelId?: string } & IGetRequest<TParam>;
export function* request<TParam>({
  cancelId,
  ...rest
}: ICancelRequest<TParam>) {
  const myRequest = yield fork(_request<TParam>, rest);
  if (cancelId) {
    yield take(`${cancelId}`);
    yield cancel(myRequest);
  }
  return myRequest;
}

// export function* request<TParam>({
//   cancelId,
//   ...rest
// }: ICancelRequest<TParam> & { callback?: (data: any) => void }) {
//   const myRequest = yield fork(_request<TParam>, rest);
  
//   if (cancelId) {
//     yield take(`${cancelId}`);
//     yield cancel(myRequest);
//   }
  
//   // Trả về request để có thể tiếp tục xử lý sau
//   return myRequest;
// }
