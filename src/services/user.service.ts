import { FilterQuery } from 'mongoose';
import User, { IUser } from '../models/User';
import AppError from '../utils/appError';

interface ListUsersQuery {
  status?: IUser['status'];
  keyword?: string;
}

class UserService {
  async listUsers(query: ListUsersQuery): Promise<IUser[]> {
    const conditions: FilterQuery<IUser> = {};
    if (query.status) {
      conditions.status = query.status;
    }
    if (query.keyword) {
      const regex = new RegExp(query.keyword, 'i');
      conditions.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    return User.find(conditions).select('-password').sort({ createdAt: -1 }).exec();
  }

  async getByUserId(userId: number): Promise<IUser> {
    const user = await User.findOne({ userId }).select('-password').exec();
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateStatus(userId: number, status: IUser['status']): Promise<IUser> {
    const user = await User.findOneAndUpdate(
      { userId },
      { status, lockedAt: status === 'locked' ? new Date() : null },
      { new: true }
    )
      .select('-password')
      .exec();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

export default new UserService();
