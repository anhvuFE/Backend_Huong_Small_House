import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import AppError from '../utils/appError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;

  if (!token) {
    throw new AppError('Unauthorized', 401);
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret) as { id: string; role: string };
    req.user = payload;
    next();
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};

export const authorize = (...roles: string[]) => (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new AppError('Forbidden', 403);
  }
  next();
};

export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;

  if (token) {
    try {
      const payload = jwt.verify(token, env.jwt.secret) as { id: string; role: string };
      req.user = payload;
    } catch (error) {
      // ignore invalid token for optional auth
    }
  }
  next();
};
