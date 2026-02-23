import { useEffect, useState, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import type { Pagination } from '@/types/pagination';
import type { ProductData } from '@/types/product';

import { apiClientGetAllProducts, apiClientGetProducts } from '@/api/client.product';
import { apiClientAddCartItem } from '@/api/client.cart';

import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationUI from '@/components/PaginationUI';
import MenuCategory from '@/components/MenuCategory';
import MenuCard from '@/components/MenuCard';
import GlobalOverlay from '@/components/GlobalOverlay';

function MenuPage() {
  // 用來判斷是否為最新請求
  const requestId = useRef<number>(0);
  // 全部產品資料
  const [products, setProducts] = useState<ProductData[]>([]);
  // 分頁
  const [pagination, setPagination] = useState<Pagination>({
    total_pages: 0,
    current_page: 0,
    has_pre: false,
    has_next: false,
    category: '',
  });
  // 產品類別
  const [categories, setCategories] = useState<string[]>([]);
  // 目前頁面
  const [currentPage, setCurrentPage] = useState<number>(1);
  // 目前選擇的類別
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  // fetch 狀態
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Overlay 顯示狀態
  const [isOverlay, setIsOverlay] = useState<boolean>(false);
  const [overlayMessage, setOverlayMessage] = useState<string>('');

  // 產品排序 (num 高到低)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => b.num - a.num);
  }, [products]);

  // 當 page 或 category 變化時觸發
  useEffect(() => {
    // 紀錄請求次數
    const currentRequest: number = ++requestId.current;

    // 取得產品列表（根據 page + category）
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await apiClientGetProducts({
          page: currentPage.toString(),
          category: selectedCategory,
        });
        // 如果不是最新的請求就不更新
        if (currentRequest !== requestId.current) {
          // console.log('不是最新的請求', currentRequest, requestId.current);
          return;
        }

        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err.message);
      } finally {
        if (currentRequest === requestId.current) {
          // 如果是最新的請求就關閉 loading
          setIsLoading(false);
        }
      }
    };
    fetchProducts();
  }, [currentPage, selectedCategory]);

  // 初始化抓 categories
  useEffect(() => {
    // 取得所有產品（主要拿 categories）
    const fetchAllProducts = async () => {
      try {
        const data = await apiClientGetAllProducts();
        const categories = [...new Set(data.products.map((p) => p.category))];
        setCategories(categories);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err.message);
      }
    };

    fetchAllProducts();
  }, []);

  // 選擇分類 (會回到第一頁)
  const handleCategoryClick = (category: string) => {
    setCurrentPage(1);
    setSelectedCategory(category);
  };

  // 加入購物車
  const handleAddToCart = async (productId: string) => {
    try {
      setOverlayMessage('加入購物車中...');
      setIsOverlay(true);
      const data = await apiClientAddCartItem({ product_id: productId, qty: 1 });
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setIsOverlay(false);
      setOverlayMessage('');
    }
  };

  return (
    <>
      {/* 全域遮罩 */}
      <GlobalOverlay isOverlay={isOverlay} message={overlayMessage} />
      <div className="container-lg">
        <div className="row g-lg-5">
          <div className="col-sm-4 col-md-3">
            <MenuCategory categories={categories} selectedCategory={selectedCategory} handleCategoryClick={handleCategoryClick} />
          </div>
          <div className="col-sm-8 col-md-9">
            {isLoading ? (
              <div className="p-4 d-flex justify-content-center align-items-center">
                <LoadingSpinner />
              </div>
            ) : sortedProducts.length > 0 ? (
              <>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {sortedProducts.map((product) => (
                    <div className="col" key={product.id}>
                      <MenuCard product={product} isOverlay={isOverlay} onAddToCart={handleAddToCart} />
                    </div>
                  ))}
                </div>

                {/* 分頁 小於等於 1 不顯示 */}
                {pagination.total_pages > 1 && <PaginationUI total_pages={pagination.total_pages} has_pre={pagination.has_pre} has_next={pagination.has_next} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
              </>
            ) : (
              <div className="text-center px-4 pb-4">
                <p className="fs-3 text-primary">目前沒有任何餐點</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuPage;
