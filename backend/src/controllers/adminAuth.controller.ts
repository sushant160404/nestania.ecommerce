import { Request, Response } from 'express';
import { databaseService } from '../services/DatabaseService';

export async function adminLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const result = await databaseService.validateAdminLogin(email, password);
    if (result.valid) {
      return res.json({ success: true, admin: result.admin });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    // Fallback: check hardcoded credentials directly if DB fails
    if (email.toLowerCase() === 'admin@nestania.com' && password === 'admin123') {
      return res.json({ success: true, admin: { email: 'admin@nestania.com', name: 'Admin User' } });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}
