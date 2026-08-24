import { Router } from 'express';
import { submitMessage, listMessages, updateMessageStatus } from '../controllers/contact.controller';

const router = Router();
router.post('/contact', submitMessage);
router.get('/contact', listMessages);
router.patch('/contact/:id/status', updateMessageStatus);

export default router;
