import axios, { AxiosRequestConfig } from "axios";

class API {
  protected instance() {
    const axiosInstance = axios.create({
      baseURL: "/",
    });

    return axiosInstance;
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance()
      .get<T>(url, config)
      .then((response) => response.data);
  }

  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.instance()
      .post<T>(url, data, config)
      .then((response) => response.data);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance()
      .delete<T>(url, config)
      .then((response) => response.data);
  }

  put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
    return this.instance()
      .put<T>(url, data, config)
      .then((response) => response.data);
  }
}

export default API;
