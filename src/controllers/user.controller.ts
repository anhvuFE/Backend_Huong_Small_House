import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import AppError from '../utils/appError';
import userService from '../services/user.service';

const parseUserId = (raw: string): number => {
  const userId = Number(raw);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError('UserId không hợp lệ', 400);
  }
  return userId;
};

export const listUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const users = await userService.listUsers({
    status: req.query.status as 'active' | 'locked' | undefined,
    keyword: (req.query.q as string) || undefined
  });
  res.json({ success: true, data: users });
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = parseUserId(req.params.userId);
  const user = await userService.getByUserId(userId);
  res.json({ success: true, data: user });
};

export const lockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = parseUserId(req.params.userId);
  const user = await userService.updateStatus(userId, 'locked');
  res.json({ success: true, data: user });
};

export const unlockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = parseUserId(req.params.userId);
  const user = await userService.updateStatus(userId, 'active');
  res.json({ success: true, data: user });
};
