import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewDataPage() {
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);

  const [selectedTable, setSelectedTable] = useState(null);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [loadingRows, setLoadingRows] = useState(false);
  const [error, setError] = useState("");

  const fetchTables = async () => {
    try {
      setLoadingTables(true);
      setError("");
      const res = await axios.get("/table/tables");
      setTables(res.data.tables || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "테이블 목록을 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoadingTables(false);
    }
  };

  
  const fetchTableData = async (tableName, nextOffset = 0) => {
    try {
      setLoadingRows(true);
      setError("");

      const res = await axios.get(`/table/tables/${tableName}`, {
        params: { limit, offset: nextOffset },
      });

      setSelectedTable(tableName);
      setRows(res.data.rows || []);
      setTotal(res.data.total || 0);
      setOffset(nextOffset);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "테이블 데이터를 불러오는 중 오류가 발생했습니다."
      );
      setRows([]);
      setTotal(0);
    } finally {
      setLoadingRows(false);
    }
  };

  // 처음 렌더링될 때 테이블 목록 한 번 가져오기
  useEffect(() => {
    fetchTables();
  }, []);

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div>
      <div className="page-header">
        <h1>DB 테이블 조회</h1>
        <p className="page-subtitle">
          DB 내 테이블 목록과 각 테이블의 데이터를 조회할 수 있습니다.
        </p>
      </div>

      <div className="tables-layout">
        {/* 왼쪽 : 테이블 목록 */}
        <div className="tables-list-card card">
          <div className="tables-list-header">
            <span>테이블 목록</span>
            <button
              type="button"
              className="btn btn-text"
              onClick={fetchTables}
              disabled={loadingTables}
            >
              새로고침
            </button>
          </div>

          {loadingTables && <p>테이블 목록 불러오는 중...</p>}

          {!loadingTables && tables.length === 0 && (
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              테이블이 없습니다. 먼저 테이블을 생성해 주세요.
            </p>
          )}

          <ul className="tables-list">
            {tables.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  className={
                    "tables-list-item" +
                    (selectedTable === name
                      ? " tables-list-item--active"
                      : "")
                  }
                  onClick={() => fetchTableData(name, 0)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 오른쪽 : 선택된 테이블 데이터 */}
        <div className="tables-data-card card">
          {selectedTable ? (
            <>
              <div className="tables-data-header">
                <h2>{selectedTable}</h2>
                <span className="tables-data-sub">
                  총 {total}행 / 페이지 {currentPage} / {totalPages}
                </span>
              </div>

              {loadingRows ? (
                <p>데이터 불러오는 중...</p>
              ) : rows.length === 0 ? (
                <p style={{ fontSize: 14, color: "#6b7280" }}>
                  데이터가 없습니다.
                </p>
              ) : (
                <div className="tables-data-table-wrapper">
                  <table className="tables-data-table">
                    <thead>
                      <tr>
                        {columns.map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr key={idx}>
                          {columns.map((col) => (
                            <td key={col}>
                              {String(
                                row[col] === null || row[col] === undefined
                                  ? ""
                                  : row[col]
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 페이지네이션 */}
              {rows.length > 0 && (
                <div className="tables-pagination">
                  <button
                    type="button"
                    className="btn btn-outlined"
                    disabled={currentPage <= 1 || loadingRows}
                    onClick={() =>
                      fetchTableData(
                        selectedTable,
                        Math.max(0, offset - limit)
                      )
                    }
                  >
                    이전
                  </button>
                  <span>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outlined"
                    disabled={currentPage >= totalPages || loadingRows}
                    onClick={() =>
                      fetchTableData(selectedTable, offset + limit)
                    }
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              왼쪽에서 테이블을 선택하면 데이터를 조회합니다.
            </p>
          )}

          {error && (
            <p style={{ marginTop: 12, fontSize: 13, color: "red" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
