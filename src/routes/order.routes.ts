import { Router } from 'express';
import { authenticate, authorize, optionalAuth } from '../middlewares/auth';
import {
  createOrder,
  createSepayCheckout,
  getOrderDetail,
  listMyOrders,
  listOrders,
  sepayCallback,
  updateOrderStatus
} from '../controllers/order.controller';

const router = Router();

router.post('/payment/sepay/callback', sepayCallback);
router.post('/', optionalAuth, createOrder);
router.get('/me', authenticate, listMyOrders);
router.get('/', authenticate, authorize('admin'), listOrders);
router.get('/:orderId', authenticate, getOrderDetail);
router.patch('/:orderId/status', authenticate, authorize('admin'), updateOrderStatus);
router.post('/:orderId/payment/sepay', optionalAuth, createSepayCheckout);

export default router;
