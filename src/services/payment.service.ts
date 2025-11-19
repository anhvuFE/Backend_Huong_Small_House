import Order from '../models/Order';
import env from '../config/env';
import { sepayClient, signSepayPayload } from '../config/sepay';
import AppError from '../utils/appError';

class PaymentService {
  async createSepayCheckout(orderId: number): Promise<{ checkoutUrl: string }> {
    const order = await Order.findOne({ orderId });
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const payload = {
      amount: order.total,
      order_id: order.orderId,
      return_url: env.sepay.returnUrl,
      cancel_url: env.sepay.returnUrl,
      callback_url: env.sepay.callbackUrl
    };

    const signature = signSepayPayload(payload);

    const response = await sepayClient.post('/', { ...payload, signature });
    const checkoutUrl = response.data?.data?.checkout_url ?? response.data?.checkout_url;

    if (!checkoutUrl) {
      throw new AppError('Could not create Sepay checkout', 500);
    }

    return { checkoutUrl };
  }

  async handleCallback(payload: Record<string, unknown>): Promise<void> {
    const signature = payload.signature as string | undefined;
    if (!signature) {
      throw new AppError('Missing signature', 400);
    }
    const { signature: _ignored, ...data } = payload;
    const computed = signSepayPayload(data);

    if (signature !== computed) {
      throw new AppError('Invalid signature', 400);
    }

    const orderId = Number(data.order_id);
    await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: 'paid', status: 'confirmed' },
      { new: true }
    );
  }
}

export default new PaymentService();
