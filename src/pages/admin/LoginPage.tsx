import { useState } from 'react';
import { toast } from 'react-toastify';

import type { Dispatch, SetStateAction, ChangeEvent, FormEvent } from 'react';
import type { LoginParams } from '@/types/login';
import type { ApiError } from '@/types/error';

import { apiAdminLogin } from '@/api/admin.login';
import { setToken } from '@/utils/token';

import IconBurger from '@/images/icon-burger.svg';

type LoginPageProps = {
  // The type of the setter function is Dispatch<SetStateAction<T>>
  setIsAuth: Dispatch<SetStateAction<boolean>>;
};

function LoginForm({ setIsAuth }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginParams>({
    username: '',
    password: '',
  });
  const [isProcessLogin, setIsProcessLogin] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessLogin(true);
    try {
      const { token, expired, message } = await apiAdminLogin(formData);
      setToken(token, expired);
      setIsAuth(true);
      toast.success(message);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setIsProcessLogin(false);
    }
  };

  return (
    <div className="bg-secondary">
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-8 col-lg-6">
            <div className="bg-white p-3 rounded-4 text-secondary text-center shadow-lg">
              <img className="w-25 mb-2" src={IconBurger} alt="logo" />
              <h2 className="fs-3 fw-bold mb-0">Pick & Take Burger</h2>
              <p className="fs-5 fw-semibold mb-3">管理後台</p>
              <form onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input type="email" name="username" onChange={handleInputChange} value={formData.username} className="form-control" id="floatingEmail" placeholder="name@example.com" autoComplete="off" disabled={isProcessLogin} />
                  <label htmlFor="floatingEmail">帳號</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" name="password" onChange={handleInputChange} value={formData.password} className="form-control" id="floatingPassword" placeholder="Password" autoComplete="off" disabled={isProcessLogin} />
                  <label htmlFor="floatingPassword">密碼</label>
                </div>
                <button type="submit" className="btn btn-primary d-flex justify-content-center align-items-center py-2 fs-5 fw-bold w-100" disabled={isProcessLogin || !formData.username || !formData.password}>
                  {!isProcessLogin ? (
                    '登入'
                  ) : (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                      <span role="status">登入中...</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
