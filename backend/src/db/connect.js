import { Pool } from 'pg';
import 'dotenv/config';

console.log('DB ENV:', {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : 'NOT SET',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// DB와 연결할 Pool을 설정 한다.
export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
});

// db와 연결이 됬는지 확인한다.
export async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    console.log('Database connection successful');
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, message: `Database connection failed: ${error.message}` };
  }
}

export default pool;
