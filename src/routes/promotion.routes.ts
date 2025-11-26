import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  createPromotion,
  getPromotionById,
  listPromotions,
  updatePromotion,
  updatePromotionStatus,
  deletePromotion,
  validatePromotion
} from '../controllers/promotion.controller';

const router = Router();

router.get('/', listPromotions);
router.post('/', authenticate, authorize('admin'), createPromotion);
router.get('/id/:id', authenticate, authorize('admin'), getPromotionById);
router.patch('/id/:id', authenticate, authorize('admin'), updatePromotion);
router.patch('/:id/status', authenticate, authorize('admin'), updatePromotionStatus);
router.delete('/id/:id', authenticate, authorize('admin'), deletePromotion);
router.get('/:code', validatePromotion);

export default router;
