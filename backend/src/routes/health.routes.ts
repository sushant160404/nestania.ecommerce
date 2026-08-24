import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';

export function healthRoutes(dbConnected: boolean): Router {
  const router = Router();
  router.get('/health', getHealth(dbConnected));
  return router;
}
