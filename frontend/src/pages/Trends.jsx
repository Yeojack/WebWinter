import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Trends() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const response = await axios.get('/chart/exports');

        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        setRows(data);
      } catch (err) {
        console.error('수출 트렌드 조회 실패', err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, []);

  const labels = rows.map((r) => r.year_month);

  const toNumArr = (key) =>
    rows.map((r) => (r[key] != null ? Number(r[key]) : null));

  const chartData = {
    labels,
    datasets: [
      {
        label: '반도체 수출 (억 달러)',
        data: toNumArr('semiconductor_100m_usd'),
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(4, 56, 168, 0.3)',
        tension: 0.2,
      },
      {
        label: '디스플레이 패널 수출 (억 달러)',
        data: toNumArr('display_panel_100m_usd'),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(24, 129, 94, 0.3)',
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
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label(ctx) {
            const label = ctx.dataset.label || '';
            const value = ctx.parsed.y;
            if (value == null) return label;
            return `${label}: ${value.toLocaleString()} 억 달러`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '년월',
        },
      },
      y: {
        title: {
          display: true,
          text: '수출액 (억 달러)',
        },
        beginAtZero: true,
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
      <div className="graph-body">
        <h3>반도체·디스플레이 수출 트렌드</h3>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
