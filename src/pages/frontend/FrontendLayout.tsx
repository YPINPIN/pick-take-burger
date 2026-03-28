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
      <main
        className="flex-fill mt-navbar"
        style={{
          backgroundColor: '#f3f4f6',
          backgroundImage: `url('https://res.cloudinary.com/ddqh0enf7/image/upload/o_4/v1774711367/small-icon-3_kdwhcm.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '280px 280px',
        }}
      >
        <Outlet />
      </main>
      <FrontendFooter />
    </div>
  );
}

export default FrontendLayout;
