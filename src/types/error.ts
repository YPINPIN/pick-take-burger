export type ApiError = {
  success: false;
  message: string; // 錯誤訊息
  data?: unknown; // 伺服器回傳的資料（若有）
  rawError?: unknown; // 原始錯誤
};
