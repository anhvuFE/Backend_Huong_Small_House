import Promotion, { IPromotion } from '../models/Promotion';
import AppError from '../utils/appError';

class PromotionService {
  list(): Promise<IPromotion[]> {
    return Promotion.find().exec();
  }

  create(payload: Partial<IPromotion>): Promise<IPromotion> {
    return Promotion.create({
      status: 'active',
      validFrom: payload.validFrom ?? new Date(),
      ...payload
    });
  }

  getById(id: string): Promise<IPromotion | null> {
    return Promotion.findById(id).exec();
  }

  async update(id: string, payload: Partial<IPromotion>): Promise<IPromotion> {
    const promo = await Promotion.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    }).exec();
    if (!promo) {
      throw new AppError('Mã không tồn tại', 404);
    }
    return promo;
  }

  async delete(id: string): Promise<void> {
    const result = await Promotion.findByIdAndDelete(id).exec();
    if (!result) {
      throw new AppError('Mã không tồn tại', 404);
    }
  }

  async updateStatus(id: string, status: 'active' | 'inactive'): Promise<IPromotion> {
    const promo = await Promotion.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).exec();
    if (!promo) {
      throw new AppError('Mã không tồn tại', 404);
    }
    return promo;
  }

  async validate(code: string): Promise<IPromotion> {
    const promo = await Promotion.findOne({ code }).exec();
    if (!promo) {
      throw new AppError('Mã không tồn tại', 404);
    }
    const now = new Date();
    if (promo.status && promo.status !== 'active') {
      throw new AppError('Mã khuyến mãi đang tạm dừng', 400);
    }
    if (promo.validFrom && promo.validFrom > now) {
      throw new AppError('Mã khuyến mãi chưa bắt đầu', 400);
    }
    if (promo.validUntil < now) {
      throw new AppError('Mã khuyến mãi đã hết hạn', 400);
    }
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      throw new AppError('Mã khuyến mãi đã được sử dụng tối đa', 400);
    }
    return promo;
  }
}

export default new PromotionService();
