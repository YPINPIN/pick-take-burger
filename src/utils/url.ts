// 驗證圖片 URL
export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (e) {
    console.error((e as Error).message);
    return false;
  }
};
