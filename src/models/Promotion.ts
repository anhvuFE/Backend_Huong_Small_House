import { Schema, model, Document } from 'mongoose';

export interface IPromotion extends Document {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  validUntil: Date;
  usageLimit: number;
  usedCount: number;
}

const promotionSchema = new Schema<IPromotion>(
  {
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Promotion = model<IPromotion>('Promotion', promotionSchema);

export default Promotion;
