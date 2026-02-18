import axios from 'axios';
import { normalizeApiError } from '@/utils/error';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const clientApi = axios.create({
  baseURL: BASE_URL,
});

clientApi.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(normalizeApiError(error));
  },
);

clientApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(normalizeApiError(error));
  },
);

export default clientApi;
