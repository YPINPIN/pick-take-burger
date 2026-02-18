import { Outlet } from 'react-router';

import FrontendHeader from '@/components/layout/FrontendHeader';
import FrontendFooter from '@/components/layout/FrontendFooter';

function FrontendLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <FrontendHeader />

      <main className="flex-fill bg-light mt-navbar py-5">
        <Outlet />
      </main>

      <FrontendFooter />
    </div>
  );
}

export default FrontendLayout;
