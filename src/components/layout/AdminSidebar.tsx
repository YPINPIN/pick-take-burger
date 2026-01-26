import BurgerIcon from '@/components/BurgerIcon';

type AdminSidebarProps = {
  showMobileSidebar: boolean;
  closeMobileSidebar: () => void;
};

function AdminSidebar({ showMobileSidebar, closeMobileSidebar }: AdminSidebarProps) {
  const sidebarContent = (
    <div className="d-flex flex-column h-100">
      <div className="d-flex align-items-center">
        <BurgerIcon className="text-primary w-25 me-2 rounded-2 shadow-sm" style={{ maxWidth: '40px', maxHeight: '40px' }} />
        <div>
          <h1 className="fs-5 fw-bold">Pick & Take Burger</h1>
          <p className="text-gray-500 fs-7">管理後台</p>
        </div>
      </div>
      <hr />
      <ul className="nav nav-pills flex-column gap-2 fs-5 flex-fill">
        <li className="nav-item">
          <a className="nav-link active" href="#">
            <i className="bi bi-box-seam me-3" />
            產品管理
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            <i className="bi bi-receipt me-3" />
            訂單管理
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" href="#">
            <i className="bi bi-ticket-perforated me-3" />
            優惠卷管理
          </a>
        </li>
      </ul>
      <hr className="d-lg-none" />
      <button type="button" className="btn-close btn-close-white p-2 fs-5 d-lg-none mx-auto" onClick={closeMobileSidebar}></button>
    </div>
  );

  return (
    <>
      {/* 桌面版 Sidebar */}
      <aside className="admin-sidebar flex-shrink-0 position-sticky top-0 start-0 bg-primary text-white p-3 vh-100 d-none d-lg-block">{sidebarContent}</aside>

      {/* 手機版 Offcanvas Sidebar */}
      <div className={`admin-sidebar-mobile d-lg-none offcanvas offcanvas-start bg-primary text-white ${showMobileSidebar ? 'show' : ''}`} style={{ visibility: showMobileSidebar ? 'visible' : 'hidden' }}>
        <div className="offcanvas-body">{sidebarContent}</div>
      </div>

      {/* 手機版背景遮罩 */}
      {showMobileSidebar && <div className="offcanvas-backdrop d-lg-none fade show" onClick={closeMobileSidebar} />}
    </>
  );
}

export default AdminSidebar;
