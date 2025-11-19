import { Request, Response } from 'express';
import promotionService from '../services/promotion.service';

export const listPromotions = async (_req: Request, res: Response): Promise<void> => {
  const promotions = await promotionService.list();
  res.json({ success: true, data: promotions });
};

export const createPromotion = async (req: Request, res: Response): Promise<void> => {
  const promotion = await promotionService.create(req.body);
  res.status(201).json({ success: true, data: promotion });
};

export const validatePromotion = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params as { code: string };
  const promotion = await promotionService.validate(code);
  res.json({ success: true, data: promotion });
};
