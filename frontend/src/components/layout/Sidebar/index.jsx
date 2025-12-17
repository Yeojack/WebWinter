// src/components/Sidebar/index.jsx

import { FaChartColumn } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router';
import { FaDatabase, FaHome, FaUpload } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import styles from './sidebar.module.css';

export default function Sidebar({ isOpen }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: '메인화면', id: 'home', icon: <FaHome />, url: '/' },
    { label: 'CSV 등록하기', id: 'upload', icon: <FaUpload />, url: '/upload' },
    { label: '등록한 CSV 조회하기', id: 'view', icon: <FaDatabase />, url: '/viewData' },
  ];

  const handleMenuClick = (menuItem) => {
    navigate(menuItem.url);
  };

  return (
    <div className={isOpen ? `${styles.sidebar} ${styles.sidebarActive}` : styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <FaChartColumn />
        </div>
        <p className={styles.logoText}>대시보드</p>
      </div>

      <div className={styles.menuList}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;

          return (
            <div
              className={isActive ? `${styles.menuItem} ${styles.menuItemActive}` : styles.menuItem}
              key={item.id}
              onClick={() => handleMenuClick(item)}
            >
              <p>{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        {user && (
        <div className={styles.user}>
          <div className={styles.profile}>[user.name?.charAt(0)]</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userRole}>{user.role === 'ADMIN' ? '관리자' : '사용자'}</div>
          </div>
        </div>
        )}
        <button onClick={handLogout} className={styles.logoutBtn}>로그아웃</button>
      </div>
    </div>
  );
}
