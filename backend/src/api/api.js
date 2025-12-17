// api/api.js
import express from 'express';
import pool, { testConnection } from '../db/connect.js';

const router = express.Router();



const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/**
 * 5) 데이터베이스 테이블 목록 조회
 *    스키마: public
 *    설명: public 스키마에 존재하는 모든 테이블 이름 조회
 *    최종 URL: GET /chart/tables
 */
router.get('/tables', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'
         AND table_type = 'BASE TABLE'
       ORDER BY table_name`,
    );

    return res.json({
      success: true,
      tables: result.rows.map((r) => r.table_name),
    });
  } catch (error) {
    console.error('List tables error:', error);
    return res.status(500).json({
      success: false,
      message: '테이블 목록 조회 중 오류가 발생했습니다.',
    });
  }
});

/**
 * 6) 테이블 데이터 조회 (공용)
 *    설명: 특정 테이블의 데이터를 limit / offset 기반으로 조회
 *    주의: SQL Injection 방지를 위해 테이블명 검증 수행
 *    최종 URL: GET /chart/tables/:tableName?limit=50&offset=0
 */
router.get('/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    let { limit = '50', offset = '0' } = req.query;

    // 1) 테이블명 검증 (SQL injection 방어)
    if (!identifierRegex.test(tableName)) {
      return res.status(400).json({
        success: false,
        message: '올바르지 않은 테이블 이름입니다.',
      });
    }

    // 숫자 파라미터 처리
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    if (Number.isNaN(limit) || limit <= 0 || limit > 1000) {
      limit = 50;
    }
    if (Number.isNaN(offset) || offset < 0) {
      offset = 0;
    }

    // 2) 실제 테이블 존재 여부 한 번 체크 (안 하면 SELECT에서 에러남)
    const existsResult = await pool.query(
      `SELECT EXISTS (
         SELECT 1
         FROM information_schema.tables
         WHERE table_schema = 'public'
           AND table_name = $1
       ) AS "exists"`,
      [tableName.toLowerCase()],
    );

    if (!existsResult.rows[0].exists) {
      return res.status(404).json({
        success: false,
        message: `"${tableName}" 테이블을 찾을 수 없습니다.`,
      });
    }

    // 3) 전체 행 개수
    const countResult = await pool.query(
      `SELECT COUNT(*) AS count FROM "${tableName}"`,
    );
    const total = Number(countResult.rows[0].count);

    // 4) 데이터 조회 (limit/offset 적용)
    const rowsResult = await pool.query(
      `SELECT * FROM "${tableName}" LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return res.json({
      success: true,
      table: tableName,
      total,
      limit,
      offset,
      rows: rowsResult.rows,
    });
  } catch (error) {
    console.error('Get table data error:', error);
    return res.status(500).json({
      success: false,
      message: '테이블 데이터 조회 중 오류가 발생했습니다.',
    });
  }
});

/**
 * 7)헬스 체크 (DB 연결 확인용)
 * 최종 URL: GET /chart/health
 */
router.get('/health', async (req, res) => {
  try {
    const result = await testConnection();
    return res.status(result.success ? 200 : 500).json({
      ok: result.success,
      message: result.message,                                      
    });
  } catch (err) {
    console.error('GET /chart/health error:', err);
    return res.status(500).json({
      ok: false,
      message: 'DB connection failed',
    });
  }
});
export default router;
