import { Schema, model, Document, Types } from 'mongoose';
import { getNextSequence } from '../utils/autoIncrement';

export interface IOrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderId: number;
  user?: Types.ObjectId;
  guest?: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid';
  status: 'pending' | 'confirmed' | 'delivered';
  note?: string;
  email: string;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: Number, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    guest: { type: Schema.Types.ObjectId, ref: 'Guest' },
    items: [
      {
        productId: { type: Number, required: true },
        name: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'Sepay', 'Bank'], default: 'COD' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' },
    note: String,
    email: { type: String, required: true }
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderId) {
    this.orderId = await getNextSequence('orders');
  }
  next();
});

const Order = model<IOrder>('Order', orderSchema);

export default Order;
