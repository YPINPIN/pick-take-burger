import adminApi from '@/api/admin';
import type { LoginParams, LoginResponse, LoginCheckResponse, LogoutResponse } from '@/types/login';

export const apiAdminLogin = async (params: LoginParams): Promise<LoginResponse> => {
  const res = await adminApi.post<LoginResponse>('/admin/signin', params);
  return res.data;
};

export const apiAdminLoginCheck = async (): Promise<LoginCheckResponse> => {
  const res = await adminApi.post<LoginCheckResponse>('api/user/check');
  return res.data;
};

export const apiAdminLogout = async (): Promise<LogoutResponse> => {
  const res = await adminApi.post<LogoutResponse>('/logout');
  return res.data;
};
