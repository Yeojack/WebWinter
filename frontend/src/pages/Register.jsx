// src/components/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toaster } from '@/components/common/toaster';
import '@/styles/register.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !name.trim() || !password) {
      toaster.create({
        type: 'warning',
        placement: 'top-right',
        title: '입력 오류',
        description: '모든 항목을 입력해 주세요.',
      });
      return;
    }

    if (password !== passwordConfirm) {
      toaster.create({
        type: 'warning',
        placement: 'top-right',
        title: '비밀번호 오류',
        description: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/register', {
        email: email.trim(),
        password,
        name: name.trim(),
      });

      toaster.create({
        type: 'success',
        placement: 'top-right',
        title: '회원가입 성공',
        description: '로그인 페이지로 이동합니다.',
      });

      navigate('/login');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        '회원가입 중 오류가 발생했습니다.';

      toaster.create({
        type: 'error',
        placement: 'top-right',
        title: '회원가입 실패',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">회원가입</h1>
        <p className="register-subtitle">
          아래 정보를 입력해 계정을 생성하세요.
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
            <label>이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
}
