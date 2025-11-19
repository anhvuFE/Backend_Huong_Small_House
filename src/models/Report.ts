import { Schema, model, Document } from 'mongoose';

export interface IReport extends Document {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  bestSeller: string;
}

const reportSchema = new Schema<IReport>(
  {
    date: { type: String, required: true },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    bestSeller: { type: String, default: '' }
  },
  { timestamps: true }
);

const Report = model<IReport>('Report', reportSchema);

export default Report;
