import { Router } from 'express';
import { getUser, updateUser } from '../controllers/users.controller';

const router = Router();
router.get('/users/:userId', getUser);
router.put('/users/:userId', updateUser);

export default router;
