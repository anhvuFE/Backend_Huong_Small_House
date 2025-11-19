"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Promotion_1 = __importDefault(require("../models/Promotion"));
const Guest_1 = __importDefault(require("../models/Guest"));
const appError_1 = __importDefault(require("../utils/appError"));
const mail_service_1 = __importDefault(require("./mail.service"));
const payment_service_1 = __importDefault(require("./payment.service"));
class OrderService {
    async createOrder(payload) {
        if (!payload.items.length) {
            throw new appError_1.default('Giỏ hàng trống', 400);
        }
        const productIds = payload.items.map((item) => item.productId);
        const products = await Product_1.default.find({ productId: { $in: productIds } }).exec();
        if (products.length !== productIds.length) {
            throw new appError_1.default('Một số sản phẩm không tồn tại', 400);
        }
        const orderItems = payload.items.map((item) => {
            const product = products.find((p) => p.productId === item.productId);
            if (product.stock < item.quantity) {
                throw new appError_1.default(`Sản phẩm ${product.name} không đủ hàng`, 400);
            }
            return {
                productId: product.productId,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            };
        });
        let total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (payload.promotionCode) {
            const promo = await Promotion_1.default.findOne({ code: payload.promotionCode }).exec();
            if (!promo) {
                throw new appError_1.default('Mã khuyến mãi không hợp lệ', 400);
            }
            if (promo.validUntil < new Date()) {
                throw new appError_1.default('Mã khuyến mãi đã hết hạn', 400);
            }
            if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
                throw new appError_1.default('Mã khuyến mãi đã được sử dụng tối đa', 400);
            }
            total = promo.type === 'percent' ? total - (total * promo.value) / 100 : total - promo.value;
            if (total < 0) {
                total = 0;
            }
            promo.usedCount += 1;
            await promo.save();
        }
        const session = {};
        if (payload.userId) {
            session.user = new mongoose_1.Types.ObjectId(payload.userId);
        }
        else if (payload.guest) {
            const guest = await Guest_1.default.create(payload.guest);
            session.guest = guest._id;
        }
        else {
            throw new appError_1.default('Thiếu thông tin người mua', 400);
        }
        const order = await Order_1.default.create({
            ...session,
            email: payload.email,
            items: orderItems,
            total,
            paymentMethod: payload.paymentMethod,
            note: payload.note
        });
        await Promise.all(products.map((product) => {
            const ordered = payload.items.find((item) => item.productId === product.productId);
            if (!ordered)
                return Promise.resolve();
            product.stock -= ordered.quantity;
            return product.save();
        }));
        await mail_service_1.default.sendOrderConfirmation(order);
        const response = { order };
        if (order.paymentMethod === 'Sepay') {
            const checkout = await payment_service_1.default.createSepayCheckout(order.orderId);
            response.checkoutUrl = checkout.checkoutUrl;
        }
        return response;
    }
    listOrders() {
        return Order_1.default.find().populate('user guest').sort({ createdAt: -1 }).exec();
    }
    listOrdersByUser(userId) {
        return Order_1.default.find({ user: userId }).sort({ createdAt: -1 }).exec();
    }
    async getOrder(orderId) {
        return Order_1.default.findOne({ orderId }).populate('user guest').exec();
    }
    async updateStatus(orderId, status) {
        const order = await Order_1.default.findOneAndUpdate({ orderId }, { status }, { new: true });
        if (!order) {
            throw new appError_1.default('Order not found', 404);
        }
        return order;
    }
    async updatePaymentStatus(orderId, paymentStatus) {
        const order = await Order_1.default.findOneAndUpdate({ orderId }, { paymentStatus }, { new: true });
        if (!order) {
            throw new appError_1.default('Order not found', 404);
        }
        return order;
    }
}
exports.default = new OrderService();
//# sourceMappingURL=order.service.js.map