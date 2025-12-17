import express from 'express';
import pool, { testConnection } from '../db/connect.js';

const router = express.Router();

// 공통 쿼리 헬퍼 함수. 많이 쓰이는 함수를 공통으로 분리
async function query(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * 1) 산업통상부_소재부품장비 생산통계 지역별 산업현황
 *    테이블: mpe_production_stats_by_region => product
 *    최종 URL: GET /chart/production?limit=100
 */
router.get('/production', async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const sql = `
      SELECT
        region,
        mpe_category_name,
        mpe_code,
        num_establishments,
        num_employees,
        value_added_million_krw,
        production_amount_million_krw,
        shipment_amount_million_krw,
        inventory_amount_million_krw
      FROM public.product
      ORDER BY region, mpe_category_name, mpe_code
      LIMIT $1
    `;

    const rows = await query(sql, [Number(limit)]);

    return res.status(200).json({
      ok: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error('GET /chart/production error:', err);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
    });
  }
});


/**
 * 2) 반도체·디스플레이 수출 트렌드
 *    테이블: public.export_semiconductor_display_trends => export
 *    최종 URL: GET /chart/exports?limit=120
 */
router.get('/exports', async (req, res) => {
  try {
    const { limit = 120 } = req.query;

    const sql = `
      SELECT
        year_month,
        semiconductor_100m_usd,
        semiconductor_yoy_change_pct,
        memory_100m_usd,
        memory_yoy_change_pct,
        memory_dram_100m_usd,
        memory_dram_yoy_change_pct,
        memory_nand_100m_usd,
        memory_nand_yoy_change_pct,
        memory_mcp_100m_usd,
        memory_mcp_yoy_change_pct,
        system_semiconductor_100m_usd,
        system_semiconductor_yoy_change_pct,
        discrete_devices_100m_usd,
        discrete_devices_yoy_change_pct,
        display_panel_100m_usd,
        display_panel_yoy_change_pct
      FROM public.export
      ORDER BY year_month
      LIMIT $1
    `;

    const rows = await query(sql, [Number(limit)]);

    return res.status(200).json({
      ok: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error('GET /chart/exports error:', err);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
    });
  }
});

/**
 * 3) 반도체·디스플레이 시장 점유율 추이
 *    테이블: public.semiconductor_display_industry_trend => market
 *    설명: 연도별 반도체·디스플레이 글로벌 시장 점유율 조회
 *    최종 URL: GET /chart/marketshare?limit=100
 */
router.get('/market', async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const sql = `
      SELECT
        year,
        semiconductor_market_share_pct,
        display_market_share_pct
      FROM public.market
      ORDER BY year
      LIMIT $1
    `;

    const rows = await query(sql, [Number(limit)]);

    return res.status(200).json({
      ok: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error('GET /market-share error:', err);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
    });
  }
});

/**
 * 4) 반도체·디스플레이 수출·수입 증가율 추이
 *    테이블: public.semiconductor_display_industry_trend => market
 *    설명: 연도별 반도체·디스플레이 수출 및 수입 증가율 조회
 *    최종 URL: GET /chart/growth?limit=100
 */
router.get('/growth', async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const sql = `
      SELECT
        year,
        semiconductor_export_growth_pct,
        semiconductor_import_growth_pct,
        display_export_growth_pct,
        display_import_growth_pct
      FROM public.market
      ORDER BY year
      LIMIT $1
    `;

    const rows = await query(sql, [Number(limit)]);

    return res.status(200).json({
      ok: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error('GET /trade-growth error:', err);
    return res.status(500).json({
      ok: false,
      message: 'Internal server error',
    });
  }
});
export default router;