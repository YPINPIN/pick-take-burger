import { useEffect, useState } from 'react';

// 營業時間 Config 24小時
const SHOP_TIME = {
  open: { hour: 11, minute: 0 }, // 11:00
  close: { hour: 21, minute: 0 }, // 21:00
};

// 時間補零
const padTime = (time: number) => String(time).padStart(2, '0');

// 時間字串
export const openTimeStr = `${padTime(SHOP_TIME.open.hour)}:${padTime(SHOP_TIME.open.minute)}`;
export const closeTimeStr = `${padTime(SHOP_TIME.close.hour)}:${padTime(SHOP_TIME.close.minute)}`;

type ShopStatus = 'normal' | 'delayed';

// 商店狀態資料
type ShopStatusResult = {
  status: ShopStatus; // 商店狀態
  isOpen: boolean; // 是否在營業時間內
  message: string; // 主要提示文案
  subMessage: string; // 次要提示文案
};

// 取得當前商店狀態
const getShopStatus = (now: Date): ShopStatusResult => {
  const totalMinutes = now.getHours() * 60 + now.getMinutes();

  const openMinutes = SHOP_TIME.open.hour * 60 + SHOP_TIME.open.minute;
  const closeMinutes = SHOP_TIME.close.hour * 60 + SHOP_TIME.close.minute;

  // 是否在營業
  const isOpen = totalMinutes >= openMinutes && totalMinutes < closeMinutes;

  if (isOpen) {
    return {
      status: 'normal',
      isOpen,
      message: '營業中，現在點餐正是時候！',
      subMessage: `下單並完成付款後，馬上為您備餐。`,
    };
  }

  return {
    status: 'delayed',
    isOpen,
    message: '店家已休息囉！',
    subMessage: `訂單將於營業時間：${openTimeStr} ~ ${closeTimeStr} 為您處理。`,
  };
};

function useShopStatus(): ShopStatusResult {
  const [result, setResult] = useState<ShopStatusResult>(() => getShopStatus(new Date()));

  useEffect(() => {
    const tick = () => {
      setResult(getShopStatus(new Date()));
      // console.log(new Date());
    };
    tick();
    const timer = setInterval(tick, 1000 * 60);

    return () => clearInterval(timer);
  }, []);

  return result;
}

export default useShopStatus;
