// src/components/chart/LineChart.jsx

import '../chartSetup';
import { Line } from 'react-chartjs-2';

export default function LineChart() {
    const labels = ['aa', 'bb', 'cc', 'dd'];
    const chartData = [
      {
        label: 'data',
        data: [0, 2, 4, 56],
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(4, 56, 168, 0.3)',
      },
      {
        label: 'data2',
        data: [4, 15, 612, 3],
        borderColor: 'rgba(42, 50, 68, 1)',
        backgroundColor: 'rgba(4, 168, 4, 0.3)',
      },
    ];
    
  return <Line data={{ labels, datasets: chartData }} />;
}
