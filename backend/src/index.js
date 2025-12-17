import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRoutes from './api/api.js';
import chartRoutes from './api/chart.js';
import uploadRoutes from './api/upload.js';
import authRoutes from './auth/auth.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/chart', chartRoutes);
app.use('/table', apiRoutes);
app.use('/upload', uploadRoutes);
app.use('/api', authRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export { app };
