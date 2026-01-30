import { useEffect, useState, useRef } from 'react';

import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import type { Pagination } from '@/types/pagination';
import type { ProductData } from '@/types/product';
import type { AdminProductModalHandle, AdminDeleteModalHandle } from '@/types/modal';

import { apiAdminGetProducts } from '@/api/admin.product';

import LoadingSpinner from '@/components/LoadingSpinner';
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
  const fetchData = async () => {
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
  };

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
    const fetchData = async () => {
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
    };
    fetchData();
  }, [currentPage]);

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
                        <td>{product.title}</td>
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
              <nav className="d-flex justify-content-center p-4">
                <ul className="pagination mb-0">
                  <li className="page-item">
                    <button onClick={() => setCurrentPage((prevPage) => prevPage - 1)} disabled={!pagination.has_pre} type="button" className={`page-link ${!pagination.has_pre ? 'disabled' : ''}`} aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className="page-item">
                      <button onClick={() => setCurrentPage(page)} disabled={currentPage === page} type="button" className={`page-link ${currentPage === page ? 'active' : ''}`}>
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button onClick={() => setCurrentPage((prevPage) => prevPage + 1)} disabled={!pagination.has_next} className={`page-link ${!pagination.has_next ? 'disabled' : ''}`} type="button" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
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
