import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { getNextSequence } from '../utils/autoIncrement';

export interface IUser extends Document {
  userId: number;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  address?: string;
  provider: 'local' | 'google';
  role: 'customer' | 'admin';
   status: 'active' | 'locked';
   lockedAt?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    userId: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatar: String,
    phone: String,
    address: String,
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    status: { type: String, enum: ['active', 'locked'], default: 'active' },
    lockedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isNew && !this.userId) {
    this.userId = await getNextSequence('users');
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;
