import { Outlet } from 'react-router';

import ScrollToTop from '@/components/layout/ScrollToTop';
import FrontendHeader from '@/components/layout/FrontendHeader';
import FrontendFooter from '@/components/layout/FrontendFooter';

function FrontendLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Scroll to top */}
      <ScrollToTop />

      <FrontendHeader />
      <main className="flex-fill bg-light mt-navbar">
        <Outlet />
      </main>
      <FrontendFooter />
    </div>
  );
}

export default FrontendLayout;
