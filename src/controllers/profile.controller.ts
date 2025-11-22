import { Response } from 'express';
import profileService from '../services/profile.service';
import { AuthRequest } from '../middlewares/auth';
import { uploadImageBuffer } from '../utils/cloudinaryUpload';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const profile = await profileService.getProfile(req.user!.id);
  res.json({ success: true, data: profile });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const payload = { ...req.body };

  if (req.file) {
    const uploaded = await uploadImageBuffer(req.file, 'avatars');
    payload.avatar = uploaded.url;
  }

  const profile = await profileService.updateProfile(req.user!.id, payload);
  res.json({ success: true, data: profile });
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  await profileService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true, message: 'Đã cập nhật mật khẩu' });
};
