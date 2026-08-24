import { Request, Response } from 'express';

export function getHealth(dbConnected: boolean) {
  return (_req: Request, res: Response) => {
    res.json({ status: 'ok', db: dbConnected ? 'mongodb' : 'memory', serverTime: new Date().toISOString() });
  };
}
