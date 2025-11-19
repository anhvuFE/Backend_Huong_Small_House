import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import AppError from '../utils/appError';
import User, { IUser } from '../models/User';
import Admin, { IAdmin } from '../models/Admin';
import env from '../config/env';
import PasswordResetToken from '../models/PasswordResetToken';
import MailService from './mail.service';

interface AuthPayload {
  id: string;
  role: string;
}

export interface AuthResult {
  user: Partial<IUser> | Partial<IAdmin>;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private signToken(payload: AuthPayload, expiresIn: string | number, secret: string): string {
    return jwt.sign(payload, secret as Secret, { expiresIn: expiresIn as SignOptions['expiresIn'] });
  }

  private buildTokens(doc: IUser | IAdmin): { accessToken: string; refreshToken: string } {
    const payload: AuthPayload = { id: doc.id, role: doc.role };
    const accessToken = this.signToken(payload, env.jwt.expiresIn, env.jwt.secret);
    const refreshToken = this.signToken(payload, env.jwt.refreshExpiresIn, env.jwt.refreshSecret);
    return { accessToken, refreshToken };
  }

  private omitPassword<T extends { password?: string }>(doc: T): Omit<T, 'password'> {
    const { password: _password, ...rest } = doc;
    return rest;
  }

  async register(data: Partial<IUser>): Promise<AuthResult> {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
      provider: 'local',
      role: 'customer'
    });

    const tokens = this.buildTokens(user);
    const sanitized = this.omitPassword(user.toObject());
    return { user: sanitized, ...tokens };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await User.findOne({ email }).select('+password');
    if (user) {
      const valid = await user.comparePassword(password);
      if (!valid) {
        throw new AppError('Invalid credentials', 401);
      }
      const tokens = this.buildTokens(user);
      const sanitized = this.omitPassword(user.toObject());
      return { user: sanitized, ...tokens };
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      throw new AppError('Account not found', 404);
    }
    const valid = await admin.comparePassword(password);
    if (!valid) {
      throw new AppError('Invalid credentials', 401);
    }
    const tokens = this.buildTokens(admin);
    const sanitized = this.omitPassword(admin.toObject());
    return { user: sanitized, ...tokens };
  }

  refresh(token: string): { accessToken: string } {
    try {
      const payload = jwt.verify(token, env.jwt.refreshSecret) as AuthPayload;
      const accessToken = this.signToken(payload, env.jwt.expiresIn, env.jwt.secret);
      return { accessToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await User.findOne({ email });
    const admin = user ? null : await Admin.findOne({ email });
    if (!user && !admin) {
      throw new AppError('Email không tồn tại', 404);
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

    await PasswordResetToken.create({
      email,
      token: hashed,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });

    await MailService.sendPasswordReset(email, rawToken);
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await PasswordResetToken.findOne({
      email,
      token: hashed,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetToken) {
      throw new AppError('Token không hợp lệ hoặc đã hết hạn', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (user) {
      user.password = newPassword;
      await user.save();
    } else {
      const admin = await Admin.findOne({ email }).select('+password');
      if (!admin) {
        throw new AppError('Tài khoản không tồn tại', 404);
      }
      admin.password = newPassword;
      await admin.save();
    }

    resetToken.used = true;
    await resetToken.save();
  }
}

export default new AuthService();
