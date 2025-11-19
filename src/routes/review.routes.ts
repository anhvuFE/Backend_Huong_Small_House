import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { createReview, listReviews } from '../controllers/review.controller';

const router = Router({ mergeParams: true });

router.get('/:productId', listReviews);
router.post('/', authenticate, createReview);

export default router;
