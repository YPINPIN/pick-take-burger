type AdminHeaderProps = {
  title: string;
  toggleMobileSidebar: () => void;
  isProcessLogout: boolean;
  onLogoutClick: () => void;
};

function AdminHeader({ title, toggleMobileSidebar, isProcessLogout, onLogoutClick }: AdminHeaderProps) {
  return (
    <header className="bg-secondary text-white px-4 py-3 d-flex justify-content-between align-items-center shadow z-1">
      <div className="d-flex align-items-center gap-3">
        {/* 手機版 sidebar 按鈕 */}
        <button type="button" className="btn btn-primary py-1 px-2 d-lg-none" onClick={toggleMobileSidebar}>
          <i className="bi bi-list fs-2 lh-1 align-middle"></i>
        </button>
        <h2 className="fs-5 font-bold">{title}</h2>
      </div>
      <div className="d-flex align-items-center gap-3 ms-auto">
        <div className="d-none d-sm-flex align-items-center gap-2 fs-7 text-gray-500">
          <i className="bi bi-person-circle"></i>
          <span>管理員：Admin</span>
        </div>
        <button type="button" className="btn btn-danger opacity-75" onClick={onLogoutClick} disabled={isProcessLogout}>
          <i className="bi bi-door-closed me-2"></i>
          {isProcessLogout ? '登出中...' : '登出'}
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
