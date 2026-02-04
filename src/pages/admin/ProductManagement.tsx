import { useEffect, useState, useRef, useCallback } from 'react';

import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import type { Pagination } from '@/types/pagination';
import type { ProductData } from '@/types/product';
import type { AdminProductModalHandle, AdminDeleteModalHandle } from '@/types/modal';

import { apiAdminGetProducts } from '@/api/admin.product';

import { PRODUCT_TAG_META, PRODUCT_RECOMMEND_META } from '@/utils/product';

import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationUI from '@/components/PaginationUI';
import AdminProductModal from '@/components/modals/AdminProductModal';
import AdminDeleteModal from '@/components/modals/AdminDeleteModal';

function ProductManagement() {
  // 全部產品資料
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination>({
    total_pages: 0,
    current_page: 0,
    has_pre: false,
    has_next: false,
    category: '',
  });
  // 產品新增/編輯 Modal
  const productModalRef = useRef<AdminProductModalHandle>(null);
  // 刪除 Modal
  const deleteModalRef = useRef<AdminDeleteModalHandle>(null);

  // 取得產品列表
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiAdminGetProducts({ page: currentPage.toString() });
      setProducts(data.products);
      setPagination(data.pagination);
      // 同步當前頁面狀態
      if (currentPage !== data.pagination.current_page) {
        setCurrentPage(data.pagination.current_page);
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // 新增產品
  const handleAddProductClick = () => {
    productModalRef.current?.open(null);
  };

  // 編輯產品
  const handleUpdateProductClick = (product: ProductData) => {
    productModalRef.current?.open(product);
  };

  // 刪除產品
  const handleDeleteProductClick = (product: ProductData) => {
    deleteModalRef.current?.open({
      id: product.id,
      title: product.title,
      type: 'product',
    });
  };

  // 更新產品成功後的回調
  const handleUpdateProductSuccess = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {/* Product Management */}
      <section>
        <div className="bg-white border border-light rounded-3 shadow-lg overflow-hidden">
          {!isLoading && (
            <div className="p-4 d-flex flex-column flex-sm-row gap-3 align-items-stretch justify-content-sm-between align-items-sm-center">
              <select className="form-select w-auto min-w-50" defaultValue="">
                <option value="">所有分類</option>
              </select>
              <button type="button" onClick={handleAddProductClick} className="btn btn-accent text-gray-900 fw-bold px-5 py-2">
                <i className="bi bi-plus-circle-fill me-2"></i>
                新增產品
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="p-4 d-flex justify-content-center align-items-center">
              <LoadingSpinner />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0 align-middle text-nowrap">
                  <thead className="table-primary">
                    <tr>
                      <th scope="col">產品主圖</th>
                      <th scope="col">產品名稱</th>
                      <th scope="col">分類</th>
                      <th scope="col">原價</th>
                      <th scope="col">售價</th>
                      <th scope="col" className="text-center">
                        上架
                      </th>
                      <th scope="col" className="text-center">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="table-image-width">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.title} className="img-fluid rounded" />
                          ) : (
                            <div className="bg-light text-secondary border rounded fs-7 d-flex align-items-center justify-content-center" style={{ width: '100%', aspectRatio: '1/1' }}>
                              暫無產品圖
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="d-flex gap-1 mb-2">
                            {/* 主廚推薦 */}
                            {product.is_recommend === 1 && <span className={`badge ${PRODUCT_RECOMMEND_META.badgeClass}`}>{PRODUCT_RECOMMEND_META.label}</span>}
                            {/* Tag 標籤 */}
                            {product.tag !== 'normal' && PRODUCT_TAG_META[product.tag] && <span className={`badge ${PRODUCT_TAG_META[product.tag].badgeClass}`}>{PRODUCT_TAG_META[product.tag].label}</span>}
                          </span>
                          {product.title}
                        </td>
                        <td>{product.category}</td>
                        <td>${product.origin_price}</td>
                        <td>${product.price}</td>
                        <td className="text-center">
                          <div className="form-check form-switch d-flex justify-content-center align-items-center">
                            <input className="form-check-input" style={{ pointerEvents: 'none' }} type="checkbox" id="checkNativeSwitch" checked={Boolean(product.is_enabled)} readOnly={true} />
                          </div>
                        </td>
                        <td className="text-center">
                          <button onClick={() => handleUpdateProductClick(product)} type="button" className="btn btn-sm btn-secondary rounded-2 me-2">
                            <i className="bi bi-pencil-square me-1" />
                            編輯
                          </button>
                          <button type="button" className="btn btn-sm btn-danger rounded-2" onClick={() => handleDeleteProductClick(product)}>
                            <i className="bi bi-trash3-fill me-1" />
                            刪除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* 分頁 */}
              <PaginationUI total_pages={pagination.total_pages} has_pre={pagination.has_pre} has_next={pagination.has_next} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </>
          ) : (
            <div className="text-center px-4 pb-4">
              <p className="fs-3 text-primary">目前沒有產品</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      <AdminProductModal ref={productModalRef} onSuccess={handleUpdateProductSuccess} />
      {/* Delete Modal */}
      <AdminDeleteModal ref={deleteModalRef} onSuccess={handleUpdateProductSuccess} />
    </>
  );
}

export default ProductManagement;
