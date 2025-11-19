import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import promotionRoutes from './promotion.routes';
import reviewRoutes from './review.routes';
import reportRoutes from './report.routes';
import feedbackRoutes from './feedback.routes';
import consultationRoutes from './consultation.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/promotions', promotionRoutes);
router.use('/reviews', reviewRoutes);
router.use('/reports', reportRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/consultations', consultationRoutes);

export default router;
