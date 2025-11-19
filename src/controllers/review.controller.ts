import { Response } from 'express';
import reviewService from '../services/review.service';
import { AuthRequest } from '../middlewares/auth';

export const listReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  const { productId } = req.params as { productId: string };
  const reviews = await reviewService.list(Number(productId));
  res.json({ success: true, data: reviews });
};

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const review = await reviewService.create({
    productId: req.body.productId,
    rating: req.body.rating,
    comment: req.body.comment,
    user: req.user?.id as string
  });
  res.status(201).json({ success: true, data: review });
};
