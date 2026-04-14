import type { ReactNode } from 'react';

type FullPageCardLayoutProps = { children: ReactNode };

function FullPageCardLayout({ children }: FullPageCardLayoutProps) {
  return (
    <div className="bg-dark d-flex flex-column min-vh-100">
      <div className="container-fluid container-sm flex-fill d-flex">
        <div className="row justify-content-center align-items-center flex-fill">
          <div className="col-md-9 col-lg-6">
            <div className="bg-white rounded-3 shadow-lg overflow-hidden">{children}</div>
          </div>
        </div>
      </div>
      <footer className="text-center p-3">
        <p className="text-secondary mb-1">&copy; 2026 Pick & Take Burger. All rights reserved.</p>
        <p className="text-secondary opacity-75">
          本網站僅供個人作品展示與學習用途，未提供實際商業服務。{' '}
          <a href="https://github.com/YPINPIN" target="_blank" rel="noopener noreferrer" className="text-secondary">
            <i className="bi bi-github me-1"></i>YPINPIN
          </a>
        </p>
      </footer>
    </div>
  );
}

export default FullPageCardLayout;
