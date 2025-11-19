import { IOrder } from '../models/Order';
export interface CreateOrderPayload {
    userId?: string;
    guest?: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    email: string;
    items: Array<{
        productId: number;
        quantity: number;
    }>;
    paymentMethod: string;
    note?: string;
    promotionCode?: string;
}
declare class OrderService {
    createOrder(payload: CreateOrderPayload): Promise<{
        order: IOrder;
        checkoutUrl?: string;
    }>;
    listOrders(): Promise<IOrder[]>;
    listOrdersByUser(userId: string): Promise<IOrder[]>;
    getOrder(orderId: number): Promise<IOrder | null>;
    updateStatus(orderId: number, status: IOrder['status']): Promise<IOrder | null>;
    updatePaymentStatus(orderId: number, paymentStatus: IOrder['paymentStatus']): Promise<IOrder | null>;
}
declare const _default: OrderService;
export default _default;
//# sourceMappingURL=order.service.d.ts.map