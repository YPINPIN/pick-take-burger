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
  const [bsDetailModal, setBsDetailModal] = useState<Modal | null>(null); // 存 Bootstrap Modal instance

  const handleShowDetail = (product: ProductData) => {
    setTempProduct({ ...product, imagesUrl: [product.imageUrl, ...product.imagesUrl] });

    if (bsDetailModal) {
      bsDetailModal.show();
    }
  };

  const handleCloseDetail = () => {
    if (bsDetailModal) {
      bsDetailModal.hide();
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
      const modal = new Modal(detailModalRef.current);
      setBsDetailModal(modal);
    }
  }, []);

  return (
    <>
      {/* Header */}
      <div className="bg-dark position-fixed top-0 z-1 w-100 border-bottom border-primary text-white px-4 py-4 shadow">
        <h3 className="fs-4 fw-bold my-1">產品管理</h3>
      </div>
      {/* Product Management */}
      <section className="mt-header position-relative z-0 p-4">
        <div className="p-4 bg-white border border-dark rounded-4 shadow-lg">
          <div className="d-flex justify-content-end align-items-center mb-4">
            <button type="button" className="btn btn-primary rounded-lg px-4 py-2" disabled>
              <i className="bi bi-plus-lg me-2" />
              新增商品
            </button>
          </div>
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center">
              <LoadingSpinner />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0 align-middle text-nowrap">
                  <thead className="table-primary">
                    <tr>
                      <th scope="col">商品名稱</th>
                      <th scope="col">分類</th>
                      <th scope="col">原價</th>
                      <th scope="col">售價</th>
                      <th scope="col" className="text-center">
                        啟用
                      </th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{product.category}</td>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td className="text-center">
                          <div className="form-check form-switch d-flex justify-content-center align-items-center">
                            <input className="form-check-input" style={{ pointerEvents: 'none' }} type="checkbox" id="checkNativeSwitch" checked={Boolean(product.is_enabled)} readOnly={true} />
                          </div>
                        </td>
                        <td>
                          <button onClick={() => handleShowDetail(product)} type="button" className="btn btn-sm btn-primary rounded-3 me-2">
                            <i className="bi bi-pencil-square me-1" />
                            查看
                          </button>
                          <button type="button" className="btn btn-sm btn-danger rounded-3" disabled>
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
              <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
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
