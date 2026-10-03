import { configService } from "@/config";
import { PUBLIC_API_PATHS } from "@/features/post/constant";
import type { ApiError, PromiseHandlers } from "@/types/axios";
import axios, {
  AxiosResponse,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

type ErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

const toBffPath = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/api/")) return path;
  return path.startsWith("/") ? `/api${path}` : `/api/${path}`;
};

const toApiError = (error: unknown): ApiError => {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return {
      status: 500,
      message: "Server Error",
    };
  }

  const data = error.response?.data;

  return {
    status: error.response?.status ?? 500,
    message: data?.message ?? "Server Error",
    errors: data?.errors,
  };
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: configService.nextPublicBaseUrl,
  withCredentials: true,
});

const refreshAxiosInstance: AxiosInstance = axios.create({
  baseURL: configService.nextPublicBaseUrl,
  withCredentials: true,
});

// Có đang refreshToken không
let isRefreshing = false;
// Ngăn xếp queue
let failedQueue: PromiseHandlers[] = [];

// Xử lí queue
const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const refreshToken = async () => {
  try {
    await refreshAxiosInstance.post(`/api/auth/refresh-token`);
    // Gắn queue  null nếu thành công
    processQueue(null);
  } catch (error) {
    processQueue(error);
    isRefreshing = false; // Đánh dấu đã refresh xong
    throw error;
  }
};
// Get token mới
const getNewToken = async () => {
  // Chưa refresh token thì đánh giấu
  if (!isRefreshing) {
    isRefreshing = true;
    await refreshToken(); // gọi lại
    isRefreshing = false; // thành công đánh dấu
    return;
  }

  // đã từng gọi thì push mảng lỗi
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
};

/// Sử dụng bắt request
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error) => {
    const originalRequest = error.config;
    const isAuthApi = PUBLIC_API_PATHS.includes(originalRequest?.url);

    const shouldRenewToken =
      error.response?.status === 401 && !isAuthApi && !originalRequest?._retry;

    // Nếu chưa từng đánh dấu thì vào
    if (shouldRenewToken) {
      // đánh dấu
      originalRequest._retry = true;

      // Gọi lại
      await getNewToken();
      try {
        return axiosInstance(originalRequest); // Trả request
      } catch (error) {
        return Promise.reject(error); // Lỗi ném reject
      }
    }
    // Đã từng đánh dấu thì ném reject
    return Promise.reject(error);
  },
);

class AxiosHttp {
  private _send = async <T = unknown>(
    method: "get" | "post" | "put" | "delete" | "patch",
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    try {
      const response = await axiosInstance.request<T>({
        ...config,
        method,
        url: toBffPath(path),
        data,
      });

      return response.data;
    } catch (error: unknown) {
      throw toApiError(error);
    }
  };

  get = <T = unknown>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("get", path, undefined, config);
  };

  post = <T = unknown>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("post", path, data, config);
  };

  put = <T = unknown>(
    path: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("put", path, data, config);
  };

  patch = <T = unknown>(
    path: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("patch", path, data, config);
  };

  del = <T = unknown>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("delete", path, undefined, config);
  };
}

export const http = new AxiosHttp();
