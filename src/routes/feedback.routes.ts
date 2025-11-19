import { Router } from 'express';
import { authenticate, authorize, optionalAuth } from '../middlewares/auth';
import {
  createFeedback,
  getFeedbackDetail,
  listFeedback,
  listMyFeedback,
  respondFeedback,
  updateFeedbackStatus
} from '../controllers/feedback.controller';

const router = Router();

router.post('/', optionalAuth, createFeedback);
router.get('/me', authenticate, listMyFeedback);
router.get('/', authenticate, authorize('admin'), listFeedback);
router.get('/:feedbackId', authenticate, getFeedbackDetail);
router.patch('/:feedbackId/status', authenticate, authorize('admin'), updateFeedbackStatus);
router.post('/:feedbackId/respond', authenticate, authorize('admin'), respondFeedback);

export default router;
