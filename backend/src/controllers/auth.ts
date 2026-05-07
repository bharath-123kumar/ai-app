import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../services/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const authController = {
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;
    try {
      const hashed = await bcrypt.hash(password, 10);
      const result = await query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, hashed, name]
      );
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      res.status(400).json({ error: 'Registration failed: ' + error.message });
    }
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    try {
      const result = await query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        console.log(`Login failed: User not found for email: ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`Login failed: Password mismatch for email: ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
      console.log(`Login successful for email: ${email}`);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
      console.error(`Login error for email ${email}:`, error);
      res.status(500).json({ error: error.message });
    }
  }
};
