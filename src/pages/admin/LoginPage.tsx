import { useState } from 'react';
import { toast } from 'react-toastify';

import type { Dispatch, SetStateAction, ChangeEvent, FormEvent } from 'react';
import type { LoginParams } from '@/types/login';
import type { ApiError } from '@/types/error';

import { apiAdminLogin } from '@/api/admin.login';
import { setToken } from '@/utils/token';

import AdminLoginLayout from '@/components/layout/AdminLoginLayout';
import BurgerIcon from '@/components/BurgerIcon';

type LoginPageProps = {
  // The type of the setter function is Dispatch<SetStateAction<T>>
  setIsAuth: Dispatch<SetStateAction<boolean>>;
};

function LoginPage({ setIsAuth }: LoginPageProps) {
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
    <AdminLoginLayout>
      <div className="p-4 text-center">
        <BurgerIcon className="text-primary w-25 rounded-2 shadow-sm mb-4" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        <h1 className="fs-4 fw-bold mb-1">Pick & Take Burger</h1>
        <p className="text-secondary fs-7 fw-medium mb-4">管理後台系統</p>
        <form onSubmit={handleLogin}>
          <div className="form-floating mb-4">
            <input type="email" name="username" onChange={handleInputChange} value={formData.username} className="form-control" id="floatingEmail" placeholder="name@example.com" autoComplete="off" disabled={isProcessLogin} />
            <label htmlFor="floatingEmail">
              <i className="bi bi-person-circle me-2"></i>帳號
            </label>
          </div>
          <div className="form-floating mb-4">
            <input type="password" name="password" onChange={handleInputChange} value={formData.password} className="form-control" id="floatingPassword" placeholder="Password" autoComplete="off" disabled={isProcessLogin} />
            <label htmlFor="floatingPassword">
              <i className="bi bi-lock-fill me-2"></i>密碼
            </label>
          </div>
          <button type="submit" className="btn btn-accent text-gray-900 d-flex justify-content-center align-items-center py-2 fs-5 fw-bold w-100" disabled={isProcessLogin || !formData.username || !formData.password}>
            {!isProcessLogin ? (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                <span>登入管理後台</span>
              </>
            ) : (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                <span role="status">登入中...</span>
              </>
            )}
          </button>
        </form>
      </div>
      <div className="p-4 text-center bg-light border-top">
        <a href="/" className="link-primary fw-bold ">
          <i className="bi bi-arrow-left me-2"></i>返回前台首頁
        </a>
      </div>
    </AdminLoginLayout>
  );
}

export default LoginPage;
