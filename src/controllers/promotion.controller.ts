import { Request, Response } from 'express';
import promotionService from '../services/promotion.service';
import AppError from '../utils/appError';

export const listPromotions = async (_req: Request, res: Response): Promise<void> => {
  const promotions = await promotionService.list();
  res.json({ success: true, data: promotions });
};

export const createPromotion = async (req: Request, res: Response): Promise<void> => {
  const promotion = await promotionService.create(req.body);
  res.status(201).json({ success: true, data: promotion });
};

export const updatePromotion = async (req: Request, res: Response): Promise<void> => {
  const promotion = await promotionService.update(req.params.id, req.body);
  res.json({ success: true, data: promotion });
};

export const getPromotionById = async (req: Request, res: Response): Promise<void> => {
  const promotion = await promotionService.getById(req.params.id);
  if (!promotion) {
    res.status(404).json({ success: false, message: 'Mã khuyến mãi không tồn tại' });
    return;
  }
  res.json({ success: true, data: promotion });
};

export const updatePromotionStatus = async (req: Request, res: Response): Promise<void> => {
  const status = req.body.status as 'active' | 'inactive';
  if (status !== 'active' && status !== 'inactive') {
    throw new AppError('Trạng thái không hợp lệ', 400);
  }
  const promotion = await promotionService.updateStatus(req.params.id, status);
  res.json({ success: true, data: promotion });
};

export const deletePromotion = async (req: Request, res: Response): Promise<void> => {
  await promotionService.delete(req.params.id);
  res.status(204).send();
};

export const validatePromotion = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params as { code: string };
  const promotion = await promotionService.validate(code);
  res.json({ success: true, data: promotion });
};
