// 驗證上傳檔案
export const validateFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!file.type || !allowedTypes.includes(file.type)) {
    return '只允許 JPG 或 PNG';
  }

  if (file.size > 3 * 1024 * 1024) {
    return '檔案不能超過 3MB';
  }

  return null;
};
