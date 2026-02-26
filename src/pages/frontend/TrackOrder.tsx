import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';

function TrackOrder() {
  const navigate = useNavigate();
  // url 參數
  const { orderId } = useParams();
  const [searchOrderId, setSearchOrderId] = useState<string>('');

  // 初始化 searchOrderId
  useEffect(() => {
    const setSearchInput = () => {
      setSearchOrderId(orderId || '');
    };

    setSearchInput();
  }, [orderId]);

  // 訂單查詢
  const handleSearch = () => {
    if (searchOrderId) {
      navigate(`/track-order/${searchOrderId}`, {
        replace: true,
      });
    }
  };

  return (
    <div className="container-lg">
      <h1 className="fs-2 fw-bold text-dark mb-3">追蹤訂單</h1>
      {/* 搜索框 */}
      <div className="row g-2">
        <div className="col col-md-7 col-lg-6 justify-content-md-center">
          <div className="form-floating">
            <input type="text" className="form-control" id="floatingOrderId" placeholder="請輸入訂單編號..." autoComplete="off" value={searchOrderId} onChange={(e) => setSearchOrderId(e.target.value)} />
            <label htmlFor="floatingOrderId">
              <i className="bi bi-receipt me-2"></i>
              訂單編號
            </label>
          </div>
        </div>
        <div className="col-auto">
          <div className="h-100 d-flex align-items-center">
            <button type="button" className="btn btn-primary d-flex justify-content-center align-items-center" onClick={handleSearch}>
              <i className="bi bi-search fs-4"></i>
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default TrackOrder;
