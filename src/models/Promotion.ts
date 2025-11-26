import { Schema, model, Document } from 'mongoose';

export interface IPromotion extends Document {
  name?: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive';
  minOrderValue?: number;
  maxDiscount?: number;
  description?: string;
}

const promotionSchema = new Schema<IPromotion>(
  {
    name: { type: String },
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    description: { type: String }
  },
  { timestamps: true }
);

const Promotion = model<IPromotion>('Promotion', promotionSchema);

export default Promotion;
