import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { createPromotion, listPromotions, validatePromotion } from '../controllers/promotion.controller';

const router = Router();

router.get('/', listPromotions);
router.post('/', authenticate, authorize('admin'), createPromotion);
router.get('/:code', validatePromotion);

export default router;
