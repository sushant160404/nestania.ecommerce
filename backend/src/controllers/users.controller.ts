import { Request, Response } from 'express';
import { databaseService } from '../services/DatabaseService';

export async function getUser(req: Request, res: Response) {
  try {
    const user = await databaseService.getUserById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { name, email, phone, addresses } = req.body;
  try {
    await databaseService.updateUser(req.params.userId, { name, email, phone, addresses });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
}
