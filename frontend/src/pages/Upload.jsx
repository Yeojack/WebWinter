// src/components/UploadCsvPage.jsx
import { useState } from 'react';
import axios from 'axios';
import { HiUpload } from 'react-icons/hi';

import { toaster } from '@/components/common/toaster';
import '../styles/upload.css';

export default function UploadCsvPage() {
  const [tableName, setTableName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  //
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tableName.trim()) {
      toaster.create({
        type: 'warning',
        title: '입력 오류',
        description: '테이블 이름을 입력해 주세요.',
      });
      return;
    }

    if (!file) {
      toaster.create({
        type: 'warning',
        title: '입력 오류',
        description: 'CSV 파일을 선택해 주세요.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('tableName', tableName.trim());
    formData.append('file', file);

    try {
      setLoading(true);

      const res = await axios.post('/upload/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toaster.create({
        type: 'success',
        title: '업로드 성공',
        description: res.data.message || 'CSV 업로드가 완료되었습니다.',
      });

      setFile(null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'CSV 업로드 중 오류가 발생했습니다.';

      toaster.create({
        type: 'error',
        title: '업로드 실패',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="upload-card">
      <div className="upload-header">
        <h2 className="upload-title">CSV 업로드</h2>
        <p className="upload-desc">
          CSV 파일을 업로드하여 선택한 테이블에 데이터를 추가합니다.
          <br />
          (CSV 첫 줄은 컬럼 이름 헤더, <b>id 컬럼은 제외</b>하고 업로드해 주세요.)
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 테이블 이름 */}
        <div className="form-field">
          <label className="form-label">테이블 이름</label>
          <input
            type="text"
            className="form-input"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="예: my_new_table"
          />
        </div>

        {/* CSV 파일 */}
        <div className="form-field">
          <label className="form-label">CSV 파일</label>

          <label className="upload-button">
            <HiUpload className="upload-icon" />
            CSV 파일 업로드
            <input
              type="file"
              accept=".csv,text/csv"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {file && <div className="file-name">선택된 파일: {file.name}</div>}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? '업로드 중...' : '업로드'}
        </button>
      </form>
    </div>
  );
}
