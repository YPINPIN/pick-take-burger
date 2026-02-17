import { NavLink } from 'react-router';

import BurgerIcon from '@/components/BurgerIcon';

function FrontendHeader() {
  return (
    <header className="w-100 border-bottom position-fixed top-0 z-3">
      <nav className="navbar navbar-expand-md fw-bold bg-primary " data-bs-theme="dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <BurgerIcon className="text-primary w-25 me-2 rounded-2 shadow-sm" style={{ maxWidth: '40px', maxHeight: '40px' }} />
            Pick <span>&</span> Take Burger
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav flex-fill gap-md-2">
              <li className="nav-item ms-md-auto">
                <NavLink className="nav-link" to="/menu">
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
                  <i className="bi bi-cart3"></i>
                  購物車
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default FrontendHeader;
