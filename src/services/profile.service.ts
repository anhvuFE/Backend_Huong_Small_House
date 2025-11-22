import User, { IUser } from '../models/User';
import Admin, { IAdmin } from '../models/Admin';
import AppError from '../utils/appError';

class ProfileService {
  async getProfile(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password');
  }

  async updateProfile(userId: string, payload: Partial<IUser>): Promise<IUser> {
    const safePayload = { ...payload };
    delete safePayload.role;
    delete safePayload.status;
    delete (safePayload as { provider?: string }).provider;
    delete (safePayload as { userId?: number }).userId;

    const user = await User.findByIdAndUpdate(userId, safePayload, { new: true }).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    let account: (IUser | IAdmin) | null = await User.findById(userId).select('+password');

    if (!account) {
      account = await Admin.findById(userId).select('+password');
    }

    if (!account) {
      throw new AppError('User not found', 404);
    }

    const match = await account.comparePassword(currentPassword);
    if (!match) {
      throw new AppError('Mật khẩu hiện tại không đúng', 400);
    }

    account.password = newPassword;
    await account.save();
  }
}

export default new ProfileService();
