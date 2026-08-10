import { Request, Response } from 'express';
import { Types } from 'mongoose';
import orderService, { CreateOrderPayload } from '../services/order.service';
import paymentService from '../services/payment.service';
import { AuthRequest } from '../middlewares/auth';
import AppError from '../utils/appError';
import { emitToAdmin, emitToUser } from '../socket';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const payload: CreateOrderPayload = {
    userId: req.user?.id,
    guest: req.body.guest,
    email: req.body.email,
    items: req.body.items,
    paymentMethod: req.body.paymentMethod,
    note: req.body.note,
    promotionCode: req.body.promotionCode
  };
  const result = await orderService.createOrder(payload);

  emitToAdmin('order:new', {
    orderId: result.order.orderId,
    total: result.order.total,
    paymentMethod: result.order.paymentMethod,
    createdAt: new Date()
  });

  res.status(201).json({ success: true, data: result });
};

export const listOrders = async (_req: Request, res: Response): Promise<void> => {
  const orders = await orderService.listOrders();
  res.json({ success: true, data: orders });
};

export const listMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const orders = await orderService.listOrdersByUser(req.user!.id);
  res.json({ success: true, data: orders });
};

// Ép orderId về số nguyên hợp lệ. Route "/:orderId" có thể nuốt cả những path
// không phải số (vd GET /orders/admin) -> Number(...) ra NaN, khiến Mongoose cast
// lỗi và trả 500. Chặn sớm ở đây và trả 400 rõ nghĩa.
const parseOrderId = (raw: string): number => {
  const orderId = Number(raw);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new AppError(`Invalid order id: "${raw}"`, 400);
  }
  return orderId;
};

const extractUserId = (order: { user?: Types.ObjectId | { _id?: Types.ObjectId } }): string | undefined => {
  const value = order.user as any;
  if (!value) return undefined;
  if (value._id) {
    return value._id.toString();
  }
  if (typeof value.toString === 'function') {
    return value.toString();
  }
  return undefined;
};

export const getOrderDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  const { orderId } = req.params as { orderId: string };
  const order = await orderService.getOrder(parseOrderId(orderId));
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  if (req.user?.role !== 'admin') {
    const ownerId = extractUserId(order);
    if (!ownerId || ownerId !== req.user?.id) {
      throw new AppError('Forbidden', 403);
    }
  }
  res.json({ success: true, data: order });
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params as { orderId: string };
  const order = await orderService.updateStatus(parseOrderId(orderId), req.body.status);

  // Báo cho khách (nếu là tài khoản đã đăng ký) khi đơn đổi trạng thái.
  if (order?.user) {
    emitToUser(String(order.user), 'order:status', {
      orderId: order.orderId,
      status: order.status,
      updatedAt: new Date()
    });
  }

  res.json({ success: true, data: order });
};

export const createSepayCheckout = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params as { orderId: string };
  const checkout = await paymentService.createSepayCheckout(parseOrderId(orderId));
  res.json({ success: true, data: checkout });
};

export const sepayCallback = async (req: Request, res: Response): Promise<void> => {
  await paymentService.handleCallback(req.body);
  res.json({ success: true });
};
