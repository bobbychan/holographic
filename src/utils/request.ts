import { Toast } from "antd-mobile";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

// if (process.env.NODE_ENV === 'development') {
//   axios.defaults.baseURL = 'https://mymytong-h5.mt0577.com';
// }
axios.defaults.baseURL = "https://h5.panda-3d.com";

interface IRequestOptions extends AxiosRequestConfig {
  silence?: boolean; // 不弹出消息提示
  skipErrorHandler?: boolean;
  [key: string]: unknown;
}

interface IRequestOptionsWithResponse extends IRequestOptions {
  getResponse: true;
}

interface IRequestOptionsWithoutResponse extends IRequestOptions {
  getResponse: false;
}

// 与后端约定的响应数据格式
interface ResponseStructure {
  data?: unknown;
  errorCode: number;
  msg?: string;
}

interface IRequest {
  <T = ResponseStructure>(
    url: string,
    config: IRequestOptionsWithResponse
  ): Promise<AxiosResponse<T>>;
  <T = ResponseStructure>(
    url: string,
    config: IRequestOptionsWithoutResponse
  ): Promise<T>;
  <T = ResponseStructure>(url: string, config: IRequestOptions): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
  <T = ResponseStructure>(url: string): Promise<T>; // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
}

const requestConfig: AxiosRequestConfig = {
  timeout: 30000,
  withCredentials: true,
};
let requestInstance: AxiosInstance;

const getRequestInstance = (): AxiosInstance => {
  if (requestInstance) return requestInstance;
  requestInstance = axios.create(requestConfig);

  // 请求拦截器
  requestInstance.interceptors.request.use(
    (config) => {
      // const access_token = window.localStorage.getItem("dayinlaAccessToken");
      const access_token = "Ob_j50XEXNIf_-R4o2KzXE4nSsVG7Wqg";
      config.headers = config.headers ?? {};

      if (access_token) {
        config.headers.Authorization = access_token;
      }
      if (config.method === "post") {
        // 签名
        const nonce = Math.random().toString(36).substring(3); // 随机字符串
        const timestamp = Math.floor(Date.now() / 1000); // 当前时间戳

        if (config.data instanceof FormData) {
          config.data.append("nonce", nonce);
          config.data.append("ts", String(timestamp));

          const configObject = {};
          for (const [key, value] of config.data) {
            // 排除文件字段
            if (value instanceof File) {
              continue;
            }
            // @ts-expect-error error
            configObject[key] = value;
          }

          // for (const formDataKey of config.data.entries()) {
          //   console.log(formDataKey, 'key');
          // }
          config.headers["Content-Type"] = "multipart/form-data";
          return config;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  requestInstance.interceptors.response.use(
    (response) => {
      // 2xx 范围内的状态码都会触发该函数
      // 根据与后端约定的响应数据格式进行统一错误处理
      const { data } = response;
      if (data?.errorCode === 1) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error: any = new Error(data.msg || "api error");
        error.name = "ApiError";
        error.info = { errorCode: data.errorCode, msg: data.msg, data };
        throw error; // 抛出自制的错误
      }
      return response;
    },
    (error) => {
      console.log(error, "request error");
      return Promise.reject(error);
    }
  );

  return requestInstance;
};

const request: IRequest = async (
  url,
  config: IRequestOptions = { method: "GET", withCredentials: false }
) => {
  const requestInstance = getRequestInstance();
  const { getResponse = false } = config;

  return new Promise((resolve, reject) => {
    requestInstance
      .request({ ...config, url })
      .then((res) => {
        resolve(getResponse ? res : res.data);
      })
      .catch((error) => {
        if (config?.skipErrorHandler) {
          throw error;
        }
        // 接收自制错误
        if (error?.name === "ApiError" && !config?.silence) {
          const errorInfo: ResponseStructure | undefined = error.info;
          if (errorInfo) {
            Toast.show({
              icon: "fail",
              content: errorInfo.msg,
            });
          }
        }
        reject(error);
      });
  });
};

export { getRequestInstance, request, requestInstance };
