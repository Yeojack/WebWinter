// src/components/chart/chartSetup.js
// 렌더링될 때마다 등록되는 것을 방지하기 위해 따로 분리

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js의 구성요소 가져와서 사용할 수 있게 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);
