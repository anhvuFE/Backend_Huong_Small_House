import { Document, Types } from 'mongoose';
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
declare const Order: import("mongoose").Model<IOrder, {}, {}, {}, Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Order;
//# sourceMappingURL=Order.d.ts.map