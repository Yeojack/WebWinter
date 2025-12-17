// src/components/common/DbConnect.jsx
import { useState } from 'react';

import axios from 'axios';

import styles from './DbConnect.module.css';

export default function DbConnect() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const checkBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/table/health');
      setMessage(response.data.message || 'Backend OK');
    } catch (error) {
      setMessage('백엔드 연결에 실패했습니다.' + (error.response ? `: ${error.response.data.message}` : ''));
    }
    setLoading(false);
  };

  return (
    <div className={styles.dbConnectBox}>
      <button className={styles.button} onClick={checkBackend} disabled={loading}>
        {loading ? 'Checking...' : 'DB 연결 확인'}
      </button>
      {message && <div className={styles.dbConnectMsg}>{message}</div>}
    </div>
  );
}
