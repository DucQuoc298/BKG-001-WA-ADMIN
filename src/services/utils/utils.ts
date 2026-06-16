import { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosClient } from "./axios";

type TResponse = AxiosResponse & {
  response?: {
    data: {
      success: boolean;
      message: string;
    }
  }
};
type TData = {
  data: object | object[];
  success: boolean;
  message?: string;
};
type TParams = object | null | object[] | boolean;
const handleGetPost = (
  route: string,
  params: TParams,
  callback?: (data: any) => void
) => {
  return axiosClient
    .post(`${route}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      throw err;
    });
};

const handleGet = (
  route: string,
  params: TParams,
  callback?: (data: any) => void
): Promise<TResponse> => {
  return axiosClient
    .get(`${route}`, { params })
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      throw err;
    });
};

const handlePost = (
  route: string,
  params: TParams,
  callback?: (data: any) => void,
): Promise<TResponse> => {
  return axiosClient
    .post(`${route}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      throw err;
    });
};
const formPost = (
  route: string,
  params: FormData,
  callback?: (data: any) => void,
  config?: AxiosRequestConfig,
): Promise<TResponse> => {
  const normalizedRoute = route.startsWith("/") ? route.slice(1) : route;
  return axiosClient
    .post(`${import.meta.env.VITE_BASE_URI || ""}/${normalizedRoute}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    })
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      throw err;
    });
};

const handlePut = (
  route: string,
  key: string,
  params: TParams,
  callback?: (data: any) => void
): Promise<TResponse> => {
  return axiosClient
    .put(`${route}/${key}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      throw err;
    });
};
const handlePutWithKey = (
  route: string,
  params: TParams,
  callback?: (data: any) => void
): Promise<TResponse> => {
  return axiosClient
    .put(`${route}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      throw err;
    });
};
const handleDelete = (
  route: string,
  key: string,
  callback?: (data: any) => void
): Promise<TResponse> => {
  return axiosClient
    .delete(`${route}/${key}`)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      throw err;
    });
};
const handleDeletes = (
  route: string,
  params: TParams,
  callback?: (data: any) => void
): Promise<TResponse> => {
  return axiosClient
    .post(`${route}`, params)
    .then((res) => {
      callback?.(res);
      return res;
    })
    .catch((err) => {
      callback?.(err);
      throw err;
    });
};

const handleGetData = (
  route: string,
  params: TParams,
  callback?: (data: TData) => void
): Promise<TData> => {
  return axiosClient
    .get(`${route}`, { params })
    .then((res) => {
      callback?.(res.data);
      return {
        data: res.data,
        success: res.data?.success,
        message: res.data?.message,
      };
    })
    .catch((err) => {
      callback?.(err);
      throw err;
    });
};

// export { handleGetPost, handleGet, handlePost, handlePut, authPost };
export {
  handleGetPost,
  handleGet,
  handleGetData,
  handlePost,
  handlePut,
  handlePutWithKey,
  handleDelete,
  handleDeletes,
  formPost,
};
