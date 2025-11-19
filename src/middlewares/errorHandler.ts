import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import logger from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (!(err instanceof AppError)) {
    logger.error(err);
  }

  res.status(status).json({
    success: false,
    message
  });
};
