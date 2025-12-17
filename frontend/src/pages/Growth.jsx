import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import '../styles/chart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function TradeGrowthTrend() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await axios.get('/chart/growth');
        setRows(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error('증가율 트렌드 조회 실패', err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, []);

  const labels = rows.map((r) => r.year);

  const chartData = {
    labels,
    datasets: [
      {
        label: '반도체 수출 증가율 (%)',
        data: rows.map((r) =>
          r.semiconductor_export_growth_pct != null
            ? Number(r.semiconductor_export_growth_pct)
            : null
        ),
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.2,
      },
      {
        label: '반도체 수입 증가율 (%)',
        data: rows.map((r) =>
          r.semiconductor_import_growth_pct != null
            ? Number(r.semiconductor_import_growth_pct)
            : null
        ),
        borderColor: 'rgba(96, 165, 250, 1)',
        tension: 0.2,
      },
      {
        label: '디스플레이 수출 증가율 (%)',
        data: rows.map((r) =>
          r.display_export_growth_pct != null
            ? Number(r.display_export_growth_pct)
            : null
        ),
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.2,
      },
      {
        label: '디스플레이 수입 증가율 (%)',
        data: rows.map((r) =>
          r.display_import_growth_pct != null
            ? Number(r.display_import_growth_pct)
            : null
        ),
        borderColor: 'rgba(5, 150, 105, 1)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: {
        title: { display: true, text: '연도' },
      },
      y: {
        title: { display: true, text: '증가율 (%)' },
      },
    },
  };

  if (loading) {
    return (
      <div className="graph-loading">
        <div className="spinner" />
        <span>데이터 로딩 중...</span>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="graph-empty">
        <p>데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="graph-container">
      <div className="graph-header">
        <h2>수출 · 수입 증가율 추이</h2>
        <p>반도체 · 디스플레이 교역 성장률</p>
      </div>

      <div className="graph-body">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
