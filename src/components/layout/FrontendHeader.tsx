import { NavLink } from 'react-router';

import BurgerIcon from '@/components/BurgerIcon';

function FrontendHeader() {
  return (
    <header className="w-100 border-bottom position-fixed top-0 z-3">
      <nav className="navbar navbar-expand-lg fw-bold bg-primary " data-bs-theme="dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <BurgerIcon className="text-primary w-25 me-2 rounded-2 shadow-sm" style={{ maxWidth: '40px', maxHeight: '40px' }} />
            Pick <span>&</span> Take Burger
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  美味 MENU
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
