function AdminFooter() {
  return (
    <footer className="fs-7 text-center p-2">
      <p className="text-secondary mb-1">&copy; 2026 Pick & Take Burger. All rights reserved.</p>
      <p className="text-secondary opacity-75">
        本網站僅供個人作品展示與學習用途，未提供實際商業服務。{' '}
        <a href="https://github.com/YPINPIN" target="_blank" rel="noopener noreferrer" className="text-secondary">
          <i className="bi bi-github me-1"></i>YPINPIN
        </a>
      </p>
    </footer>
  );
}

export default AdminFooter;
