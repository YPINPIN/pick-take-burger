import axios from 'axios';
import { getToken } from '@/utils/token';
import { normalizeApiError } from '@/utils/error';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_PATH = import.meta.env.VITE_API_PATH;

const adminApi = axios.create({
  baseURL: BASE_URL,
});

adminApi.interceptors.request.use(
  (request) => {
    const token = getToken();

    if (token) {
      // 帶入 token
      request.headers['Authorization'] = token;
    }

    return request;
  },
  (error) => {
    return Promise.reject(normalizeApiError(error));
  }
);

adminApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(normalizeApiError(error));
  }
);

export default adminApi;
