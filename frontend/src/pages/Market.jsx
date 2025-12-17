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

export default function MarketShareTrend() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await axios.get('/chart/market');
        setRows(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error('시장 점유율 조회 실패', err);
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
        label: '반도체 시장 점유율 (%)',
        data: rows.map((r) =>
          r.semiconductor_market_share_pct != null
            ? Number(r.semiconductor_market_share_pct)
            : null
        ),
        borderColor: 'rgba(235, 37, 113, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.2,
      },
      {
        label: '디스플레이 시장 점유율 (%)',
        data: rows.map((r) =>
          r.display_market_share_pct != null
            ? Number(r.display_market_share_pct)
            : null
        ),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: {
        title: { display: true, text: '연도' },
      },
      y: {
        title: { display: true, text: '점유율 (%)' },
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
        <h2>시장 점유율 추이</h2>
        <p>반도체 · 디스플레이 글로벌 시장 점유율</p>
      </div>

      <div className="graph-body">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
