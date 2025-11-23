import { NextFunction, Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import env from '../config/env';
import AppError from '../utils/appError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
  newAccessToken?: string;
}

const refreshAccessToken = (refreshToken: string): { id: string; role: string; accessToken: string } | null => {
  try {
    const payload = jwt.verify(refreshToken, env.jwt.refreshSecret as Secret) as { id: string; role: string };
    const accessToken = jwt.sign(
      { id: payload.id, role: payload.role },
      env.jwt.secret as Secret,
      { expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'] }
    );
    return { id: payload.id, role: payload.role, accessToken };
  } catch (error) {
    return null;
  }
};

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
  const refreshHeader = req.headers['x-refresh-token'];
  const refreshToken =
    typeof refreshHeader === 'string'
      ? refreshHeader
      : (req as Request & { cookies?: Record<string, string> }).cookies?.refreshToken;

  if (!token) {
    if (!refreshToken) {
      throw new AppError('Unauthorized', 401);
    }
    const refreshed = refreshAccessToken(refreshToken);
    if (!refreshed) {
      throw new AppError('Invalid token', 401);
    }
    req.user = { id: refreshed.id, role: refreshed.role };
    req.newAccessToken = refreshed.accessToken;
    res.setHeader('x-access-token', refreshed.accessToken);
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret as Secret) as { id: string; role: string };
    req.user = payload;
    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError && refreshToken) {
      const refreshed = refreshAccessToken(refreshToken);
      if (refreshed) {
        req.user = { id: refreshed.id, role: refreshed.role };
        req.newAccessToken = refreshed.accessToken;
        res.setHeader('x-access-token', refreshed.accessToken);
        next();
        return;
      }
    }

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
