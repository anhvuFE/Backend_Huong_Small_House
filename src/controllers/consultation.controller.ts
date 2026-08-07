import { Response } from 'express';
import consultationService from '../services/consultation.service';
import { AuthRequest } from '../middlewares/auth';
import AppError from '../utils/appError';
import { emitToAdmin, emitToConsultation } from '../socket';

const lastMessage = (c: { messages: unknown[] }) => c.messages[c.messages.length - 1];

export const createConsultation = async (req: AuthRequest, res: Response): Promise<void> => {
  const payload = {
    userId: req.user?.id,
    name: req.body.name,
    email: req.body.email,
    topic: req.body.topic,
    message: req.body.message
  };
  if (!payload.name || !payload.email || !payload.topic || !payload.message) {
    throw new AppError('Thiếu thông tin tư vấn', 400);
  }
  const consultation = await consultationService.create(payload);
  emitToAdmin('consultation:new', {
    id: consultation.id,
    name: consultation.name,
    topic: consultation.topic,
    createdAt: new Date()
  });
  res.status(201).json({ success: true, data: consultation });
};

export const listConsultations = async (_req: AuthRequest, res: Response): Promise<void> => {
  const consultations = await consultationService.listAll();
  res.json({ success: true, data: consultations });
};

export const listMyConsultations = async (req: AuthRequest, res: Response): Promise<void> => {
  const consultations = await consultationService.listByUser(req.user!.id);
  res.json({ success: true, data: consultations });
};

export const getConsultationDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  const { consultationId } = req.params as { consultationId: string };
  const consultation = await consultationService.getById(consultationId);
  if (!consultation) {
    throw new AppError('Consultation not found', 404);
  }
  if (req.user?.role !== 'admin' && consultation.user?.toString() !== req.user?.id) {
    throw new AppError('Forbidden', 403);
  }
  res.json({ success: true, data: consultation });
};

export const userSendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  const { consultationId } = req.params as { consultationId: string };
  const consultation = await consultationService.getById(consultationId);
  if (!consultation) {
    throw new AppError('Consultation not found', 404);
  }
  if (consultation.user?.toString() !== req.user?.id) {
    throw new AppError('Forbidden', 403);
  }
  const updated = await consultationService.userMessage(consultationId, req.body.message);
  emitToConsultation(consultationId, 'consultation:message', lastMessage(updated));
  emitToAdmin('consultation:message', { consultationId, message: lastMessage(updated) });
  res.json({ success: true, data: updated });
};

export const adminSendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  const { consultationId } = req.params as { consultationId: string };
  const updated = await consultationService.adminMessage(consultationId, req.body.message);
  emitToConsultation(consultationId, 'consultation:message', lastMessage(updated));
  res.json({ success: true, data: updated });
};

export const closeConsultation = async (req: AuthRequest, res: Response): Promise<void> => {
  const { consultationId } = req.params as { consultationId: string };
  const updated = await consultationService.closeConsultation(consultationId);
  res.json({ success: true, data: updated });
};
