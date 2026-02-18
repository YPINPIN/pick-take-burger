import type { Pagination } from '@/types/pagination';

// 產品標籤
export type ProductTag = 'normal' | 'hot' | 'new';

export type ProductData = {
  id: string;
  title: string;
  category: string;
  origin_price: number;
  price: number;
  unit: string;
  description: string;
  content: string;
  is_enabled: 0 | 1;
  imageUrl: string;
  imagesUrl: string[];
  num: number; // 顯示順序
  // 新增的欄位
  tag: ProductTag; // 產品標籤
  is_recommend: 0 | 1; // 是否為推薦商品
};

export type GetProductsParams = {
  page?: string;
  category?: string;
};

export type GetProductsResponse = {
  success: boolean;
  products: ProductData[];
  pagination: Pagination;
  messages: unknown[];
};

export type CreateProductData = Omit<ProductData, 'id' | 'num'>;

export type UpdateProductParams = {
  id: string;
  data: CreateProductData;
};

type MessageResponse = {
  success: boolean;
  message: string;
};

export type CreateProductResponse = MessageResponse;
export type UpdateProductResponse = MessageResponse;
export type DeleteProductResponse = MessageResponse;

// 定義後台一次取得所有商品回應型別
export type GetAllProductsResponse = {
  success: boolean;
  products: {
    [key: string]: ProductData;
  };
};

// 定義前台一次取得所有商品回應型別
export type GetClientAllProductsResponse = {
  success: boolean;
  products: ProductData[];
};

export type GetClientProductDetailResponse = {
  success: boolean;
  product: ProductData;
};
