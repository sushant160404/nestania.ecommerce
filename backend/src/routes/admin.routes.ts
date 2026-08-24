import { Router } from 'express';
import { adminLogin } from '../controllers/adminAuth.controller';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { updateOrderStatus } from '../controllers/orders.controller';
import {
  listAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/adminProducts.controller';
import { handleUpload } from '../controllers/upload.controller';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/admin/login', adminLogin);

router.get('/admin/dashboard/stats', getDashboardStats);
router.patch('/admin/orders/:id/status', updateOrderStatus);

router.get('/admin/products', listAdminProducts);
router.get('/admin/products/:id', getAdminProduct);
router.post('/admin/products', createProduct);
router.put('/admin/products/:id', updateProduct);
router.delete('/admin/products/:id', deleteProduct);

router.post('/admin/upload', upload.single('file'), handleUpload);

export default router;
