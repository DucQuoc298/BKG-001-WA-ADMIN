/** @format */

import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { KEY_CONTEXT } from 'themes/config';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ─── helpers đọc/ghi localStorage trực tiếp (không dùng hook) ────────────────

const getAuthStorage = (): Record<string, any> => {
  try {
    return JSON.parse(localStorage.getItem(KEY_CONTEXT.AUTH) ?? '{}');
  } catch {
    return {};
  }
};

const updateTokenInStorage = (token: string, newRefreshToken?: string) => {
  const auth = getAuthStorage();
  localStorage.setItem(
    KEY_CONTEXT.AUTH,
    JSON.stringify({
      ...auth,
      token,
      ...(newRefreshToken ? { refreshToken: newRefreshToken } : {}),
    }),
  );
};

const clearAuthStorage = () => {
  localStorage.removeItem(KEY_CONTEXT.AUTH);
};

// ─── queue các request chờ refresh ───────────────────────────────────────────

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!),
  );
  pendingQueue = [];
};

// ─── axios instance ───────────────────────────────────────────────────────────

const BASE = `${import.meta.env.VITE_BASE_URI || ''}`;

const apiConfig = {
  baseURL: `${BASE}/directRouter/index`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const axiosClient = axios.create(apiConfig);

// ─── request interceptor ──────────────────────────────────────────────────────

const requestInterceptor = (req: InternalAxiosRequestConfig) => {
  const { token } = getAuthStorage();
  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
};

// ─── response interceptor (xử lý 401 + refresh) ──────────────────────────────

const errorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as ExtendedAxiosRequestConfig;

  if (error.response?.status !== 401 || originalRequest._retry) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  // Nếu đang refresh → queue lại, chờ token mới
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      pendingQueue.push({ resolve, reject });
    }).then((token) => {
      originalRequest.headers!.Authorization = `Bearer ${token}`;
      return axiosClient(originalRequest);
    });
  }

  isRefreshing = true;
  const { refreshToken, token: expiredToken } = getAuthStorage();

  try {
    // Dùng axios thuần (không qua axiosClient) để tránh circular import + loop vô hạn
    // Payload khớp với authorization.ts → refreshToken()
    const res = await axios.post(
      `${BASE}/directRouter/index`,
      {
        action: 'ConnectDB',
        method: 'refreshToken',
        data: [{ refreshToken }],
      },
      { headers: { Authorization: `Bearer ${expiredToken}` } },
    );

    const result = res.data?.result?.data ?? res.data?.data ?? res.data;
    const newToken: string = result?.token ?? result?.accessToken ?? result;
    const newRefreshToken: string | undefined = result?.refreshToken;

    updateTokenInStorage(newToken, newRefreshToken);
    processQueue(null, newToken);

    originalRequest.headers!.Authorization = `Bearer ${newToken}`;
    return axiosClient(originalRequest);
  } catch (refreshError) {
    processQueue(refreshError, null);
    clearAuthStorage();
    window.location.href = '/login';
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
};

// ─── đăng ký interceptors ─────────────────────────────────────────────────────

axiosClient.interceptors.request.use(
  requestInterceptor,
  (err: AxiosError) => Promise.reject(err),
);

axiosClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  errorInterceptor,
);

export { apiConfig, axiosClient };

