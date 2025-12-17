import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);
import '../styles/chart.css';

export default function ProductionBarChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/chart/production", {
        params: { limit: 100 },
      });

      const rows = res.data.data || [];


      const regionMap = {};

      rows.forEach((row) => {
        const region = row.region;
        const value = Number(row.production_amount_million_krw || 0);

        if (!regionMap[region]) {
          regionMap[region] = 0;
        }
        regionMap[region] += value;
      });

      const labels = Object.keys(regionMap);
      const values = Object.values(regionMap);

      setChartData({
        labels,
        datasets: [
          {
            label: "지역별 생산액 (백만원)",
            data: values,
            backgroundColor: "rgba(59, 130, 246, 0.7)",
          },

          
        ],
      });
    } catch (err) {
      setError("차트 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>차트 로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!chartData) return null;

  return (
    <div style={{ width: "100%", maxWidth: 900 }}>
      <h2>지역별 생산액</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            y: {
              ticks: {
                callback: (value) => value.toLocaleString(),
              },
            },
          },
        }}
      />
    </div>
  );
}
