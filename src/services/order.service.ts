import { Types } from 'mongoose';
import Order, { IOrder, IOrderItem } from '../models/Order';
import Product from '../models/Product';
import Promotion from '../models/Promotion';
import Guest from '../models/Guest';
import AppError from '../utils/appError';
import MailService from './mail.service';
import paymentService from './payment.service';
import logger from '../utils/logger';

export interface CreateOrderPayload {
  userId?: string;
  guest?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  email: string;
  items: Array<{ productId: number; quantity: number }>;
  paymentMethod: string;
  note?: string;
  promotionCode?: string;
}

// Chữ ký bất biến của giỏ hàng (không phụ thuộc thứ tự) để so khớp đơn trùng.
const itemsSignature = (items: Array<{ productId: number; quantity: number }>): string =>
  items
    .map((i) => `${i.productId}x${i.quantity}`)
    .sort()
    .join('|');

class OrderService {
  async createOrder(payload: CreateOrderPayload): Promise<{ order: IOrder; checkoutUrl?: string }> {
    if (!payload.items.length) {
      throw new AppError('Giỏ hàng trống', 400);
    }

    const productIds = payload.items.map((item) => item.productId);
    const products = await Product.find({ productId: { $in: productIds } }).exec();

    if (products.length !== productIds.length) {
      throw new AppError('Một số sản phẩm không tồn tại', 400);
    }

    const orderItems: IOrderItem[] = payload.items.map((item) => {
      const product = products.find((p) => p.productId === item.productId)!;
      if (product.stock < item.quantity) {
        throw new AppError(`Sản phẩm ${product.name} không đủ hàng`, 400);
      }
      return {
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      };
    });

    // Idempotency: chặn đơn TRÙNG do double-submit / retry mạng. Nếu cùng người
    // mua đặt đúng các sản phẩm & phương thức thanh toán trong ~15s gần nhất thì
    // trả lại đơn đã tạo thay vì tạo mới (đặt TRƯỚC promo & trừ kho để không
    // double-count usedCount / stock).
    const buyerFilter = payload.userId
      ? { user: new Types.ObjectId(payload.userId) }
      : { email: payload.email };
    const recentOrder = await Order.findOne({
      ...buyerFilter,
      paymentMethod: payload.paymentMethod,
      createdAt: { $gte: new Date(Date.now() - 15_000) }
    })
      .sort({ createdAt: -1 })
      .exec();
    if (recentOrder && itemsSignature(recentOrder.items) === itemsSignature(payload.items)) {
      const duplicateResponse: { order: IOrder; checkoutUrl?: string } = { order: recentOrder };
      if (recentOrder.paymentMethod === 'Sepay') {
        const checkout = await paymentService.createSepayCheckout(recentOrder.orderId);
        duplicateResponse.checkoutUrl = checkout.checkoutUrl;
      }
      return duplicateResponse;
    }

    let total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (payload.promotionCode) {
      const promo = await Promotion.findOne({ code: payload.promotionCode }).exec();
      if (!promo) {
        throw new AppError('Mã khuyến mãi không hợp lệ', 400);
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
      if (promo.minOrderValue && total < promo.minOrderValue) {
        throw new AppError(`Đơn tối thiểu ${promo.minOrderValue}đ để dùng mã`, 400);
      }

      const discount =
        promo.type === 'percent' ? (total * promo.value) / 100 : promo.value;
      const cappedDiscount =
        promo.maxDiscount && promo.maxDiscount > 0 && discount > promo.maxDiscount
          ? promo.maxDiscount
          : discount;

      total = Math.max(0, total - cappedDiscount);
      promo.usedCount += 1;
      await promo.save();
    }

    const session: { user?: Types.ObjectId; guest?: Types.ObjectId } = {};
    if (payload.userId) {
      session.user = new Types.ObjectId(payload.userId);
    } else if (payload.guest) {
      const guest = await Guest.create(payload.guest);
      session.guest = guest._id;
    } else {
      throw new AppError('Thiếu thông tin người mua', 400);
    }

    // Trừ kho ATOMIC: điều kiện `stock >= qty` nằm ngay trong lệnh update nên hai
    // đơn đồng thời không thể cùng "mua" phần hàng cuối (chống bán vượt kho / race).
    // Nếu bất kỳ mặt hàng nào không đủ, hoàn lại phần đã trừ trước đó rồi báo lỗi.
    const reserved: Array<{ productId: number; quantity: number }> = [];
    const rollbackStock = (): Promise<unknown> =>
      Promise.all(
        reserved.map((r) => Product.updateOne({ productId: r.productId }, { $inc: { stock: r.quantity } }))
      );

    for (const item of payload.items) {
      const updated = await Product.findOneAndUpdate(
        { productId: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      ).exec();
      if (!updated) {
        await rollbackStock();
        const product = products.find((p) => p.productId === item.productId);
        throw new AppError(`Sản phẩm ${product?.name ?? item.productId} không đủ hàng`, 400);
      }
      reserved.push({ productId: item.productId, quantity: item.quantity });
    }

    let order: IOrder;
    try {
      order = await Order.create({
        ...session,
        email: payload.email,
        items: orderItems,
        total,
        paymentMethod: payload.paymentMethod,
        note: payload.note
      });
    } catch (err) {
      // Tạo đơn thất bại sau khi đã trừ kho -> hoàn kho để không thất thoát.
      await rollbackStock();
      throw err;
    }

    // Email xác nhận là best-effort: lỗi gửi mail KHÔNG được làm hỏng đơn.
    try {
      await MailService.sendOrderConfirmation(order);
    } catch (err) {
      logger.error('Order confirmation email failed (order still created): %s', (err as Error).message);
    }

    const response: { order: IOrder; checkoutUrl?: string } = { order };
    if (order.paymentMethod === 'Sepay') {
      const checkout = await paymentService.createSepayCheckout(order.orderId);
      response.checkoutUrl = checkout.checkoutUrl;
    }

    return response;
  }

  listOrders(): Promise<IOrder[]> {
    return Order.find().populate('user guest').sort({ createdAt: -1 }).exec();
  }

  listOrdersByUser(userId: string): Promise<IOrder[]> {
    return Order.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async getOrder(orderId: number): Promise<IOrder | null> {
    return Order.findOne({ orderId }).populate('user guest').exec();
  }

  async updateStatus(orderId: number, status: IOrder['status']): Promise<IOrder | null> {
    const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    return order;
  }

  async updatePaymentStatus(orderId: number, paymentStatus: IOrder['paymentStatus']): Promise<IOrder | null> {
    const order = await Order.findOneAndUpdate({ orderId }, { paymentStatus }, { new: true });
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    return order;
  }
}

export default new OrderService();
