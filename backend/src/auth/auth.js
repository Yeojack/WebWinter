import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import pool from '../db/connect.js';
import 'dotenv/config';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.BCRYPT_SALT_ROUNDS || '1d';
const SALT_ROUNDS = 10
export function signToken(user) {
    const payload = {
        id:user.id,
        email:user.email,
        name:user.name,
        role:user.role
    };
}

export function vertifyToken(token) {
    try {
        return jwt.verify(token,JWT_SECRET);
    } catch(e) {
        return null;
    }
}

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email?.trim() || !password || !name?.trim()) {
        return res.status(400).json({ message: '필수 항목을 입력해 주세요.' });
    }

    try {
        const exists = await pool.query(
            'SELECT 1 FROM users WHERE email = $1',
            [email.trim()]
        );

        if (exists.rowCount > 0) {
            return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        await pool.query (
            `
            INSERT INTO users (email, password_hash, name)
            VALUES ($1, $2, $3)
            `,
            [email.trim(), passwordHash, name.trim()]
        );

        return res.status(201).json({
            message: '회원가입 성공'
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
            return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' });
    }
    try {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1 LIMIT 1',
        [email.trim()]
      );

      const user = rows[0];

      if (!user) {
        return res.status(401).json({message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      if (user.status !== 'ACTIVE') {
        return res.status(403).json({message: '비활성화된 계정입니다.' });
      }
      const ok = await bcrypt.compare(password, user.password_hash);
      if(!ok) {
        return res.status(401).json({message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }
      
      await pool.query (
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [user.id]
      );

      const token = signToken(user);
      
      return res.json({
        message: '로그인 성공',
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role:user.role,
        },
      });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
});

router.get('/me', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    try {
        const token = auth.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ user: decoded });
    } catch {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
});

export default router;