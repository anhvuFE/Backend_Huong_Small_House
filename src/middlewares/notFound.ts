import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

// Route không khớp -> đẩy sang errorHandler dưới dạng 404 JSON nhất quán.
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};
