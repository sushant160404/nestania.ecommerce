import { Router } from 'express';

import { healthRoutes } from './health.routes';
import categoriesRoutes from './categories.routes';
import productsRoutes from './products.routes';
import couponsRoutes from './coupons.routes';
import ordersRoutes from './orders.routes';
import wishlistRoutes from './wishlist.routes';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import pincodeRoutes from './pincode.routes';
import newsletterRoutes from './newsletter.routes';
import contactRoutes from './contact.routes';
import reviewsRoutes from './reviews.routes';
import adminRoutes from './admin.routes';

/** Builds the top-level /api router from every resource's sub-router. */
export function createApiRouter(dbConnected: boolean): Router {
  const router = Router();

  router.use(healthRoutes(dbConnected));
  router.use(categoriesRoutes);
  router.use(productsRoutes);
  router.use(couponsRoutes);
  router.use(ordersRoutes);
  router.use(wishlistRoutes);
  router.use(authRoutes);
  router.use(usersRoutes);
  router.use(pincodeRoutes);
  router.use(newsletterRoutes);
  router.use(contactRoutes);
  router.use(reviewsRoutes);
  router.use(adminRoutes);

  return router;
}
