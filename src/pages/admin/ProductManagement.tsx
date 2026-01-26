import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'bootstrap';

import type { ApiError } from '@/types/error';
import type { Pagination } from '@/types/pagination';
import type { ProductData } from '@/types/product';

import { apiAdminGetProducts } from '@/api/admin.product';

import LoadingSpinner from '@/components/LoadingSpinner';

function ProductManagement() {
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
  const [tempProduct, setTempProduct] = useState<ProductData | null>(null);
  const detailModalRef = useRef(null);
  const bsDetailModal = useRef<Modal | null>(null); // 存 Bootstrap Modal instance

  const handleShowDetail = (product: ProductData) => {
    setTempProduct({ ...product, imagesUrl: [product.imageUrl, ...product.imagesUrl] });

    if (bsDetailModal.current) {
      bsDetailModal.current.show();
    }
  };

  const handleCloseDetail = () => {
    if (bsDetailModal.current) {
      bsDetailModal.current.hide();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await apiAdminGetProducts({ page: currentPage.toString() });
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    // 初始化一次
    if (detailModalRef.current) {
      bsDetailModal.current = new Modal(detailModalRef.current);
    }
  }, []);

  return (
    <>
      {/* Product Management */}
      <section>
        <div className="bg-white border border-light rounded-3 shadow-lg overflow-hidden">
          <div className="p-4 d-flex flex-column flex-sm-row gap-3 align-items-stretch justify-content-sm-between align-items-sm-center">
            <select className="form-select w-auto min-w-50">
              <option value="" selected>
                所有分類
              </option>
              <option value="美式漢堡">美式漢堡</option>
            </select>
            <button type="button" className="btn btn-accent text-gray-900 fw-bold px-5 py-2">
              <i className="bi bi-plus-circle-fill me-2"></i>
              新增商品
            </button>
          </div>
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
                      <th scope="col">商品主圖</th>
                      <th scope="col">商品名稱</th>
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
                          <img src={product.imageUrl} alt={product.title} className="img-fluid rounded" />
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
                          <button onClick={() => handleShowDetail(product)} type="button" className="btn btn-sm btn-secondary rounded-2 me-2">
                            <i className="bi bi-pencil-square me-1" />
                            查看
                          </button>
                          <button type="button" className="btn btn-sm btn-danger rounded-2" disabled>
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
            <div className="text-center">
              <p className="fs-3 text-primary">目前沒有商品</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <div ref={detailModalRef} className="modal fade" id="productInfoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 fw-bold" id="staticBackdropLabel">
                {tempProduct?.title}
              </h1>
              <button type="button" className="btn-close" onClick={handleCloseDetail}></button>
            </div>
            <div className="modal-body">
              <div className="row row-cols-2 row-cols-md-3 g-2">
                {tempProduct?.imagesUrl.map((image, index) => (
                  <div className="col" key={image}>
                    <img src={image} className="object-fit-cover rounded" alt={`圖片${index + 1}`} />
                  </div>
                ))}
              </div>

              <span className="my-2 badge rounded-pill text-bg-secondary">{tempProduct?.category}</span>
              <p>商品描述：{tempProduct?.description}</p>
              <p>商品內容：{tempProduct?.content}</p>
              <p className="fs-4">
                <span>
                  <del>原價：$ {tempProduct?.origin_price}</del>
                </span>
                <span className="text-danger float-end">$ {tempProduct?.price}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductManagement;
