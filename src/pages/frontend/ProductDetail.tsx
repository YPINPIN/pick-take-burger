import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import type { ProductData } from '@/types/product';

import { apiClientGetProductDetail } from '@/api/client.product';

import LoadingSpinner from '@/components/LoadingSpinner';

function ProductDetail() {
  const navigate = useNavigate();
  // url 參數
  const { productId } = useParams();

  const requestId = useRef<number>(0);

  // 產品資料
  const [product, setProduct] = useState<ProductData | null>(null);
  // fetch 狀態
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const currentRequest: number = ++requestId.current;

    // 取得產品詳細資料
    const fetchProductDetail = async (id: string | undefined) => {
      setIsLoading(true);
      try {
        if (!id) return;
        const data = await apiClientGetProductDetail(id);

        // 如果不是最新的請求就不更新
        if (currentRequest !== requestId.current) {
          // console.log('不是最新的請求', currentRequest, requestId.current);
          return;
        }
        setProduct(data.product);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err.message);
        // 跳轉到 menu 頁面
        navigate('/menu', { replace: true });
      } finally {
        if (currentRequest === requestId.current) {
          // 如果是最新的請求就關閉 loading
          setIsLoading(false);
        }
      }
    };

    console.log('productId', productId);
    fetchProductDetail(productId);
  }, [productId, navigate]);

  return (
    <div className="container-lg">
      {isLoading ? (
        <div className="p-4 d-flex justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div>{JSON.stringify(product)}</div>
      )}
    </div>
  );
}

export default ProductDetail;
