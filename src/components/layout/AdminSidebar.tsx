import { useState } from 'react';
import IconBurger from '@/images/icon-burger.svg';

function AdminSidebar() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const toggleMobileSidebar = () => setShowMobileSidebar((show) => !show);

  const sidebarContent = (
    <>
      <div className="d-flex justify-content-between justify-content-lg-around align-items-center mb-3">
        <div className="w-25 d-none d-lg-block">
          <img src={IconBurger} alt="logo" />
        </div>
        <div className="fw-bold ">
          <h1 className="fs-6 my-1">Pick & Take Burger</h1>
          <p className="fs-6 mb-0 ">管理後台</p>
        </div>
        <button type="button" className="btn-close btn-close-white d-lg-none" onClick={toggleMobileSidebar}></button>
      </div>
      <hr />
      <ul className=" nav nav-pills flex-column gap-3 fs-5">
        <li className="nav-item">
          <a className="nav-link active" href="#">
            <i className="bi bi-box-seam me-2" />
            產品管理
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            <i className="bi bi-receipt me-2" />
            訂單管理
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" href="#">
            <i className="bi bi-ticket-perforated me-2" />
            未開放
          </a>
        </li>
      </ul>
    </>
  );

  return (
    <>
      {/* 手機版切換按鈕 */}
      <button className="btn btn-dark p-2 border-0 border-end border-primary rounded-0 d-lg-none" type="button" onClick={toggleMobileSidebar}>
        <i className="bi bi-box-arrow-right" />
      </button>
      {/* 桌面版 Sidebar */}
      <aside className="admin-sidebar d-none d-lg-block flex-shrink-0 position-sticky top-0 start-0 bg-dark border-end border-primary text-white p-3 vh-100">{sidebarContent}</aside>

      {/* 手機版 Offcanvas Sidebar */}
      <div className={`admin-sidebar-mobile d-lg-none offcanvas offcanvas-start bg-dark text-white ${showMobileSidebar ? 'show' : ''}`} style={{ visibility: showMobileSidebar ? 'visible' : 'hidden' }}>
        <div className="offcanvas-body">{sidebarContent}</div>
      </div>

      {/* 手機版背景遮罩 */}
      {showMobileSidebar && <div className="offcanvas-backdrop d-lg-none fade show" onClick={toggleMobileSidebar} />}
    </>
  );
}

export default AdminSidebar;
