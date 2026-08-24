import { Request, Response } from 'express';
import { databaseService } from '../services/DatabaseService';

export async function register(req: Request, res: Response) {
  const { email, password, name, phone } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  try {
    const user = await databaseService.registerUser(email, password, name, phone);
    res.status(201).json({ success: true, user });
  } catch (error: any) {
    if (error.message === 'Email already registered') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const result = await databaseService.validateUserLogin(email, password);
    if (result.valid && result.user) {
      return res.json({ success: true, user: result.user });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
}
