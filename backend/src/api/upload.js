
// 맨 위 쪽에 추가
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import express from 'express';
import pool, { testConnection } from '../db/connect.js';

const router = express.Router();

// 이미 위쪽에 있을 수 있음
const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

// multer 메모리 저장소 사용 (파일을 디스크에 안 쓰고 메모리에 올림)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 최대 10MB 정도 (원하면 조정)
  },
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { tableName } = req.body;
    const file = req.file;

    if (!tableName || typeof tableName !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: '테이블 이름이 필요합니다.' });
    }

    const trimmedTableName = tableName.trim();

    if (!identifierRegex.test(trimmedTableName)) {
      return res.status(400).json({
        success: false,
        message: '올바르지 않은 테이블 이름입니다.',
      });
    }

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: 'CSV 파일이 업로드되지 않았습니다.' });
    }


    const existsResult = await pool.query(
      `SELECT EXISTS (
         SELECT 1
         FROM information_schema.tables
         WHERE table_schema = 'public'
           AND table_name = $1
       ) AS "exists"`,
      [trimmedTableName.toLowerCase()],
    );

    if (!existsResult.rows[0].exists) {
      return res.status(404).json({
        success: false,
        message: `"${trimmedTableName}" 테이블을 찾을 수 없습니다.`,
      });
    }

    // 2) CSV 파싱
    const csvString = file.buffer.toString('utf-8');

    const records = parse(csvString, {
      columns: true,          // 첫 줄을 헤더로 사용해서 object로 변환
      skip_empty_lines: true,
      trim: true,
    });

    if (!records.length) {
      return res
        .status(400)
        .json({ success: false, message: 'CSV에 데이터가 없습니다.' });
    }

    // 3) 컬럼 목록 추출 (CSV 헤더)
    const columnNames = Object.keys(records[0]);

    if (!columnNames.length) {
      return res.status(400).json({
        success: false,
        message: 'CSV 헤더(컬럼 이름)를 찾을 수 없습니다.',
      });
    }

    // id 컬럼은 자동 생성 컬럼이라 CSV에서 넣지 않도록 처리
    const filteredColumnNames = columnNames.filter(
      (name) => name.toLowerCase() !== 'id',
    );

    if (!filteredColumnNames.length) {
      return res.status(400).json({
        success: false,
        message: 'id 외에 적어도 1개 이상의 컬럼이 필요합니다.',
      });
    }

    // 컬럼명 유효성 체크
    for (const colName of filteredColumnNames) {
      if (!identifierRegex.test(colName)) {
        return res.status(400).json({
          success: false,
          message: `컬럼 이름 "${colName}" 이(가) 올바르지 않습니다.`,
        });
      }
    }

    // 4) INSERT 쿼리 생성 (다중 행)
    //    INSERT INTO "table" ("col1","col2") VALUES ($1,$2),($3,$4),...

    const columnListSql = filteredColumnNames
      .map((name) => `"${name}"`)
      .join(', ');

    const values = [];
    const valuePlaceholders = records.map((row, rowIndex) => {
      const rowValues = filteredColumnNames.map((col) => {
        const v = row[col];
        // 빈 문자열은 NULL로 치환 (원하면 그대로 ''로 두어도 됨)
        return v === '' ? null : v;
      });
      values.push(...rowValues);

      const baseIndex = rowIndex * filteredColumnNames.length;
      const placeholders = filteredColumnNames.map(
        (_, colIndex) => `$${baseIndex + colIndex + 1}`,
      );
      return `(${placeholders.join(', ')})`;
    });

    const insertSql = `
      INSERT INTO "${trimmedTableName}" (${columnListSql})
      VALUES ${valuePlaceholders.join(',\n             ')}
    `;

    await pool.query(insertSql, values);

    return res.json({
      success: true,
      message: `"${trimmedTableName}" 테이블에 ${records.length}개의 행이 추가되었습니다.`,
      inserted: records.length,
    });
  } catch (error) {
    console.error('CSV upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'CSV 업로드/저장 중 오류가 발생했습니다.',
    });
  }
});
export default router;