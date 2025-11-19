import { Response } from 'express';
import feedbackService from '../services/feedback.service';
import { AuthRequest } from '../middlewares/auth';
import AppError from '../utils/appError';

export const createFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  const payload = {
    userId: req.user?.id,
    name: req.body.name,
    email: req.body.email,
    orderId: req.body.orderId,
    productId: req.body.productId,
    message: req.body.message
  };
  if (!payload.email || !payload.message) {
    throw new AppError('Thiếu thông tin liên hệ hoặc nội dung', 400);
  }
  const feedback = await feedbackService.create(payload);
  res.status(201).json({ success: true, data: feedback });
};

export const listMyFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  const feedback = await feedbackService.listByUser(req.user!.id);
  res.json({ success: true, data: feedback });
};

export const listFeedback = async (_req: AuthRequest, res: Response): Promise<void> => {
  const feedback = await feedbackService.listAll();
  res.json({ success: true, data: feedback });
};

export const getFeedbackDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  const { feedbackId } = req.params as { feedbackId: string };
  const feedback = await feedbackService.getById(feedbackId);
  if (!feedback) {
    throw new AppError('Feedback not found', 404);
  }
  if (req.user?.role !== 'admin' && feedback.user?.toString() !== req.user?.id) {
    throw new AppError('Forbidden', 403);
  }
  res.json({ success: true, data: feedback });
};

export const updateFeedbackStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { feedbackId } = req.params as { feedbackId: string };
  const feedback = await feedbackService.updateStatus(feedbackId, req.body.status);
  res.json({ success: true, data: feedback });
};

export const respondFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  const { feedbackId } = req.params as { feedbackId: string };
  const feedback = await feedbackService.respond(feedbackId, req.body.response);
  res.json({ success: true, data: feedback });
};
