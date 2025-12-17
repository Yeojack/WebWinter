// src/components/layout/Header/index.jsx

import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

import DbConnect from '@/components/common/DbConnect';

import styles from './header.module.css';

export default function Header({ isOpen, onClickToggleBtn }) {
  return (
    <div className={styles.header}>
      <button className={styles.button} onClick={onClickToggleBtn}>
        {isOpen ? <MdKeyboardDoubleArrowLeft /> : <MdKeyboardDoubleArrowRight />}
      </button>
      <div className={styles.spacer}></div>
      <div className={styles.actions}>
        <DbConnect />
      </div>
    </div>
  );
}
