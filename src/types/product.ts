import type { Pagination } from '@/types/pagination';

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
