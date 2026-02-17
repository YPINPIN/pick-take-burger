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
        <p className="text-secondary">Copyright &copy; 2026 Pick & Take Burger. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FullPageCardLayout;
