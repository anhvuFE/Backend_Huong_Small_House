import { Schema, model, Document } from 'mongoose';

export interface IReport extends Document {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  bestSeller: string;
  userStats?: {
    totalUsers: number;
    newUsers: number;
    lockedUsers: number;
    activeCustomers: number;
  };
  topCustomers?: Array<{
    userId: number;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

const reportSchema = new Schema<IReport>(
  {
    date: { type: String, required: true },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    bestSeller: { type: String, default: '' },
    userStats: {
      totalUsers: { type: Number },
      newUsers: { type: Number },
      lockedUsers: { type: Number },
      activeCustomers: { type: Number }
    },
    topCustomers: [
      {
        userId: { type: Number },
        name: { type: String },
        email: { type: String },
        totalOrders: { type: Number },
        totalSpent: { type: Number }
      }
    ]
  },
  { timestamps: true }
);

const Report = model<IReport>('Report', reportSchema);

export default Report;
