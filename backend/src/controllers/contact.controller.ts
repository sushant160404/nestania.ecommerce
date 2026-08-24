import { Request, Response } from 'express';
import { databaseService } from '../services/DatabaseService';

export async function submitMessage(req: Request, res: Response) {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address required' });
  }
  try {
    const result = await databaseService.saveContactMessage({ name, email, phone: phone || '', subject: subject || 'General', message });
    res.status(201).json({ success: true, id: result.id, message: "We've received your message and will reply within 24 hours." });
  } catch (error) {
    console.error('Contact save error:', error);
    res.status(500).json({ error: 'Failed to save message. Please try again.' });
  }
}

export async function listMessages(_req: Request, res: Response) {
  try {
    const messages = await databaseService.getAllContactMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
}

export async function updateMessageStatus(req: Request, res: Response) {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status required' });
  try {
    await databaseService.updateContactMessageStatus(req.params.id, status);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
}
