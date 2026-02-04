import adminApi from './admin';

import type { UploadImageResponse } from '@/types/upload';

const API_PATH = import.meta.env.VITE_API_PATH;

export const apiAdminUploadImage = async (formData: FormData): Promise<UploadImageResponse> => {
  const res = await adminApi.post(`api/${API_PATH}/admin/upload`, formData);
  return res.data;
};
