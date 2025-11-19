import Promotion, { IPromotion } from '../models/Promotion';
import AppError from '../utils/appError';

class PromotionService {
  list(): Promise<IPromotion[]> {
    return Promotion.find().exec();
  }

  create(payload: Partial<IPromotion>): Promise<IPromotion> {
    return Promotion.create(payload);
  }

  async validate(code: string): Promise<IPromotion> {
    const promo = await Promotion.findOne({ code }).exec();
    if (!promo) {
      throw new AppError('Mã không tồn tại', 404);
    }
    return promo;
  }
}

export default new PromotionService();
