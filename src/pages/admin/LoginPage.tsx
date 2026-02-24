import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import type { LoginParams } from '@/types/login';
import type { ApiError } from '@/types/error';
import type { SubmitHandler } from 'react-hook-form';

import { apiAdminLogin } from '@/api/admin.login';
import { getToken, setToken } from '@/utils/token';

import FullPageCardLayout from '@/components/layout/FullPageCardLayout';
import BurgerIcon from '@/components/BurgerIcon';

function LoginPage() {
  const navigate = useNavigate();

  // 表單資料
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginParams>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [isProcessLogin, setIsProcessLogin] = useState<boolean>(false);

  const handleLogin: SubmitHandler<LoginParams> = async (formData) => {
    try {
      setIsProcessLogin(true);
      const { token, expired, message } = await apiAdminLogin(formData);
      setToken(token, expired);
      // 登入成功，跳轉到管理後台
      navigate('/admin', { replace: true });
      toast.success(message);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setIsProcessLogin(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    // 有 token，直接跳轉到管理後台
    if (token) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  return (
    <FullPageCardLayout>
      <div className="p-4 text-center">
        <BurgerIcon className="text-primary w-25 rounded-2 shadow-sm mb-4" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        <h1 className="fs-4 fw-bold mb-1">Pick & Take Burger</h1>
        <p className="text-secondary fs-7 fw-medium mb-4">管理後台系統</p>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="form-floating mb-2">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="name@example.com"
              autoComplete="off"
              {...register('username', {
                required: '請輸入帳號 (Email)',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '帳號 (Email) 格式不正確',
                },
              })}
              disabled={isProcessLogin}
            />
            <label htmlFor="floatingEmail">
              <i className="bi bi-person-circle me-2"></i>
              帳號 (Email)
            </label>
            <p className={`fs-7 text-danger text-start px-3 lh-1 mt-1 ${errors.username ? 'visible' : 'invisible'}`}>{errors.username ? errors.username.message : '提示'}</p>
          </div>
          <div className="form-floating mb-2">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              autoComplete="off"
              {...register('password', {
                required: '請輸入密碼',
                minLength: {
                  value: 6,
                  message: '密碼長度至少需 6 碼',
                },
              })}
              disabled={isProcessLogin}
            />
            <label htmlFor="floatingPassword">
              <i className="bi bi-lock-fill me-2"></i>
              密碼
            </label>
            <p className={`fs-7 text-danger text-start px-3 lh-1 mt-1 ${errors.password ? 'visible' : 'invisible'}`}>{errors.password ? errors.password.message : '提示'}</p>
          </div>
          <button type="submit" className="btn btn-accent text-gray-900 d-flex justify-content-center align-items-center py-2 fs-5 fw-bold w-100" disabled={isProcessLogin || !isValid}>
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
        <Link to="/" className="link-primary fw-bold ">
          <i className="bi bi-arrow-left me-2"></i>返回前台首頁
        </Link>
      </div>
    </FullPageCardLayout>
  );
}

export default LoginPage;
