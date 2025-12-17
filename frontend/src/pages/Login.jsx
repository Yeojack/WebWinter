// src/components/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { toaster } from '@/components/common/toaster';
import '@/styles/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toaster.create({
        type: 'warning',
        placement: 'top-right',
        title: '입력 오류',
        description: '이메일과 비밀번호를 모두 입력해 주세요.',
      });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post('/api/login', {
        email: email.trim(),
        password,
      });

      const { token, user } = res.data;
      login(token, user);

      toaster.create({
        type: 'success',
        placement: 'top-right',
        title: '로그인 성공',
        description: `${user.name}님 환영합니다.`,
      });

      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        '로그인 중 오류가 발생했습니다.';

      toaster.create({
        type: 'error',
        placement: 'top-right',
        title: '로그인 실패',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>
        <p className="login-subtitle">
          이메일과 비밀번호를 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
           <button  onClick={() => navigate('/register')}
            className="register-button"
            >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
