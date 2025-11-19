import { Response } from 'express';
import profileService from '../services/profile.service';
import { AuthRequest } from '../middlewares/auth';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const profile = await profileService.getProfile(req.user!.id);
  res.json({ success: true, data: profile });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const profile = await profileService.updateProfile(req.user!.id, req.body);
  res.json({ success: true, data: profile });
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  await profileService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true, message: 'Đã cập nhật mật khẩu' });
};
