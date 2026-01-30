import type { ProductData } from '@/types/product';

// 產品資料去除多餘空白
export const trimProduct = (data: ProductData): ProductData => ({
  ...data,
  title: data.title.trim(),
  category: data.category.trim(),
  unit: data.unit.trim(),
  description: data.description.trim(),
  content: data.content.trim(),
});

// 驗證產品資料
export const validateProduct = (data: ProductData): string | null => {
  if (!data.title) return '請輸入商品名稱';
  if (!data.category) return '請輸入分類';
  if (!data.unit) return '請輸入單位';
  if (data.price <= 0) return '售價必須大於 0';
  if (data.origin_price < data.price) return '原價不可低於售價';

  return null;
};
