import { NavLink } from 'react-router';

import BurgerIcon from '@/components/BurgerIcon';

function FrontendHeader() {
  return (
    <nav className="navbar navbar-expand-md fw-bold bg-primary w-100 border-bottom position-fixed top-0 z-10" data-bs-theme="dark">
      <div className="container-lg">
        <NavLink className="navbar-brand" to="/">
          <BurgerIcon className="text-primary w-25 me-2 rounded-2 shadow-sm" style={{ maxWidth: '40px', maxHeight: '40px' }} />
          Pick <span>&</span> Take Burger
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header pb-0">
            <h5 className="offcanvas-title d-flex align-items-center" id="offcanvasNavbarLabel">
              <i className="bi bi-list fs-3 me-2"></i>
              主選單
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav flex-fill gap-md-2">
              <li className="nav-item ms-md-auto">
                <NavLink className="nav-link" to="/menu" end>
                  <i className="bi bi-fork-knife"></i>
                  美味 MENU
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/track-order">
                  <i className="bi bi-receipt-cutoff"></i>
                  訂單查詢
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  <i className="bi bi-shop"></i>
                  品牌故事
                </NavLink>
              </li>
              <li className="nav-item ms-md-auto">
                <NavLink className="nav-link" to="/cart">
                  <i className="bi bi-cart"></i>
                  購物車
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default FrontendHeader;
