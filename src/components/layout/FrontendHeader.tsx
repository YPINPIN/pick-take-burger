import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router';

import useCart from '@/hooks/useCart';

import BurgerIcon from '@/components/BurgerIcon';
import CartTip from '@/components/CartTip';

function FrontendHeader() {
  const location = useLocation();
  const { cartState, getCartInfo } = useCart();

  // 取得購物車資訊（用於顯示購物車數量）
  useEffect(() => {
    getCartInfo({ silent: true });
  }, [getCartInfo]);

  useEffect(() => {
    // 每次路由變化，清掉 activeElement，以避免 focus 錯誤
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [location]);

  return (
    <nav className="navbar navbar-expand-md fw-bold bg-primary w-100 border-bottom position-fixed top-0 z-10" data-bs-theme="dark">
      <div className="container-lg">
        <NavLink className="navbar-brand" to="/">
          <BurgerIcon className="text-primary w-25 me-2 rounded-2 shadow-sm" style={{ maxWidth: '40px', maxHeight: '40px' }} />
          Pick <span>&</span> Take Burger
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon position-relative">
            <CartTip cartNum={cartState.carts.length} />
          </span>
        </button>
        <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header pb-0">
            <h5 className="offcanvas-title d-flex align-items-center" id="offcanvasNavbarLabel">
              <i className="bi bi-layout-sidebar-inset-reverse fs-3 me-2"></i>
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
                  追蹤訂單
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
                  <span className="position-relative">
                    購物車
                    <CartTip cartNum={cartState.carts.length} />
                  </span>
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
