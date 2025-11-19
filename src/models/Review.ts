import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  productId: number;
  user: Types.ObjectId;
  rating: number;
  comment?: string;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String
  },
  { timestamps: true }
);

const Review = model<IReview>('Review', reviewSchema);

export default Review;
