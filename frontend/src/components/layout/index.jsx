// src/components/layout/index.jsx

import { Outlet } from 'react-router';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

import useSidebar from '@/hooks/useSidebar';
import styles from '@/styles/layout.module.css';

export default function Layout() {
  const { isOpen, toggle } = useSidebar();

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isOpen} />
      <div className={isOpen ? `${styles.contentBox} ${styles.contentBoxActive}` : styles.contentBox}>
        <Header onClickToggleBtn={toggle} isOpen={isOpen} />
        <div className={styles.innerContentBox}>
          <div className={styles.center}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
