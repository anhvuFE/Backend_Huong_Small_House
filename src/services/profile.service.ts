import User, { IUser } from '../models/User';
import AppError from '../utils/appError';

class ProfileService {
  async getProfile(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password');
  }

  async updateProfile(userId: string, payload: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, payload, { new: true }).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const match = await user.comparePassword(currentPassword);
    if (!match) {
      throw new AppError('Mật khẩu hiện tại không đúng', 400);
    }
    user.password = newPassword;
    await user.save();
  }
}

export default new ProfileService();
