import { Request, Response } from 'express';
import authService from '../services/auth.service';
import profileService from '../services/profile.service';
import { AuthRequest } from '../middlewares/auth';

const setRefreshCookie = (res: Response, refreshToken: string): void => {
  const secure = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: secure ? 'none' : 'lax',
    secure,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.register(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({ success: true, data: result });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  setRefreshCookie(res, result.refreshToken);
  res.json({ success: true, data: result });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const bodyRefreshToken = (req.body as { refreshToken?: string }).refreshToken;
  const cookieRefreshToken = (req as Request & { cookies?: Record<string, string> }).cookies?.refreshToken;
  const refreshToken = bodyRefreshToken || cookieRefreshToken;
  if (!refreshToken) {
    res.status(401).json({ success: false, message: 'Missing refresh token' });
    return;
  }
  const result = authService.refresh(refreshToken);
  setRefreshCookie(res, refreshToken);
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
