import { Request, Response } from 'express';
import authService from '../services/auth.service';
import profileService from '../services/profile.service';
import { AuthRequest } from '../middlewares/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json({ success: true, data: result });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  const result = authService.refresh(refreshToken);
  res.json({ success: true, data: result });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  await authService.requestPasswordReset(email);
  res.json({ success: true, message: 'Đã gửi email đặt lại mật khẩu' });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, token, password } = req.body;
  await authService.resetPassword(email, token, password);
  res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  await profileService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true, message: 'Đã cập nhật mật khẩu' });
};
