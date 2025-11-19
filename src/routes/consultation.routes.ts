import { Router } from 'express';
import { authenticate, authorize, optionalAuth } from '../middlewares/auth';
import {
  adminSendMessage,
  closeConsultation,
  createConsultation,
  getConsultationDetail,
  listConsultations,
  listMyConsultations,
  userSendMessage
} from '../controllers/consultation.controller';

const router = Router();

router.post('/', optionalAuth, createConsultation);
router.get('/', authenticate, authorize('admin'), listConsultations);
router.get('/me', authenticate, listMyConsultations);
router.get('/:consultationId', authenticate, getConsultationDetail);
router.post('/:consultationId/messages', authenticate, userSendMessage);
router.post('/:consultationId/admin/messages', authenticate, authorize('admin'), adminSendMessage);
router.post('/:consultationId/close', authenticate, authorize('admin'), closeConsultation);

export default router;
