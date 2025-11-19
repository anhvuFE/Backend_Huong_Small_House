import { Schema, model, Document } from 'mongoose';

export interface IPasswordResetToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const PasswordResetToken = model<IPasswordResetToken>('PasswordResetToken', passwordResetTokenSchema);

export default PasswordResetToken;
