import Review, { IReview } from '../models/Review';
import AppError from '../utils/appError';

class ReviewService {
  list(productId: number): Promise<IReview[]> {
    return Review.find({ productId }).populate('user', 'name').exec();
  }

  async create(payload: { productId: number; user: string; rating: number; comment?: string }): Promise<IReview> {
    const existing = await Review.findOne({ productId: payload.productId, user: payload.user }).exec();
    if (existing) {
      throw new AppError('Bạn đã đánh giá sản phẩm này', 400);
    }
    return Review.create(payload);
  }
}

export default new ReviewService();
