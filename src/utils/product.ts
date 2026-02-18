import type { ProductData, ProductTag } from '@/types/product';

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

// 產品標籤相關 map 資料
export const PRODUCT_TAG_META: Record<
  ProductTag,
  {
    label: string; // 標籤label
    badgeClass: string; // 前台標籤class
    sortWeight: number; // 排序權重
    iconClass: string; // icon class
  }
> = {
  normal: {
    label: '一般商品',
    badgeClass: '',
    sortWeight: 0,
    iconClass: 'bi bi-box me-1',
  },
  hot: {
    label: '熱銷推薦',
    badgeClass: 'text-bg-danger rounded-pill',
    sortWeight: 2,
    iconClass: 'bi bi-hand-thumbs-up-fill me-1',
  },
  new: {
    label: '新品上市',
    badgeClass: 'text-bg-success rounded-pill',
    sortWeight: 1,
    iconClass: 'bi bi-star-fill me-1',
  },
};

// 產品推薦
export const PRODUCT_RECOMMEND_META = { label: '主廚推薦', badgeClass: 'bg-accent text-dark rounded-pill', iconClass: 'bi bi-award-fill me-1' };

// 產品分類
export const PRODUCT_CATEGORY_META = [
  {
    category: '',
    iconClass: 'bi bi-grid-fill',
  },
  {
    category: '美式漢堡',
    iconClass: 'bi bi-fork-knife',
  },
  {
    category: '開胃炸物',
    iconClass: 'bi bi-fire',
  },
  {
    category: '沙拉與湯品',
    iconClass: 'bi bi-leaf-fill',
  },
  {
    category: '特色飲品',
    iconClass: 'bi bi-cup-straw',
  },
];
