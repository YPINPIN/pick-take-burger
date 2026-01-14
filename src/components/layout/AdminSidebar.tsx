import IconBurger from '@/images/icon-burger.svg';

function AdminSidebar() {
  return (
    <aside className="admin-sidebar position-sticky top-0 start-0 bg-dark border-end border-primary text-white p-3 vh-100">
      <div className="d-flex justify-content-around align-items-center mb-3">
        <div className="w-25">
          <img src={IconBurger} alt="logo" />
        </div>
        <div className="fs-6 fw-bold text-center">
          <h1 className="fs-6 my-1">Pick & Take Burger</h1>
          <p className="fs-6 mb-0">管理後台</p>
        </div>
      </div>
      <hr />
      <ul className=" nav nav-pills flex-column gap-3 fs-5">
        <li className="nav-item">
          <a className="nav-link active" href="#">
            <i className="bi bi-box-seam" />
            產品管理
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            <i className="bi bi-receipt" />
            訂單管理
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" href="#">
            <i className="bi bi-ticket-perforated" />
            未開放
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
