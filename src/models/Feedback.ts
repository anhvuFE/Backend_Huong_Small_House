import { Schema, model, Document, Types } from 'mongoose';

export interface IFeedback extends Document {
  user?: Types.ObjectId;
  name?: string;
  email: string;
  orderId?: number;
  productId?: number;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  response?: string;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: { type: String, required: true },
    orderId: Number,
    productId: Number,
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    response: String
  },
  { timestamps: true }
);

const Feedback = model<IFeedback>('Feedback', feedbackSchema);

export default Feedback;
