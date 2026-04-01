// 將 timestamp 轉換為 YYYY-MM-DD HH:MM
export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
};

export const formatStatusDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

export const formatStatusTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${hour}:${minute}`;
};

export const formatCouponDueDate = (timestamp: number, isInput: boolean = false) => {
  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = isInput ? `${year}-${month}-${day}` : `${year}/${month}/${day}`;

  return formattedDate;
};

// 將 YYYY-MM-DD 轉成台灣當天結束的 UNIX timestamp (秒)
export const toTaiwanEndOfDayTimestamp = (dateStr: string): number => {
  // 解析日期字串
  const [year, month, day] = dateStr.split('-').map(Number);

  // 建立台灣時間的 Date 物件
  const date = new Date();
  date.setFullYear(year, month - 1, day); // JS 月份是 0~11
  date.setHours(23, 59, 59, 999); // 當天 23:59:59.999

  // 轉成 timestamp（秒）
  return Math.floor(date.getTime() / 1000);
};
