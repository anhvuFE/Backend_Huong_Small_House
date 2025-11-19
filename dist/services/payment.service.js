"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(require("../models/Order"));
const env_1 = __importDefault(require("../config/env"));
const sepay_1 = require("../config/sepay");
const appError_1 = __importDefault(require("../utils/appError"));
class PaymentService {
    async createSepayCheckout(orderId) {
        const order = await Order_1.default.findOne({ orderId });
        if (!order) {
            throw new appError_1.default('Order not found', 404);
        }
        const payload = {
            amount: order.total,
            order_id: order.orderId,
            return_url: env_1.default.sepay.returnUrl,
            cancel_url: env_1.default.sepay.returnUrl,
            callback_url: env_1.default.sepay.callbackUrl
        };
        const signature = (0, sepay_1.signSepayPayload)(payload);
        const response = await sepay_1.sepayClient.post('/', { ...payload, signature });
        const checkoutUrl = response.data?.data?.checkout_url ?? response.data?.checkout_url;
        if (!checkoutUrl) {
            throw new appError_1.default('Could not create Sepay checkout', 500);
        }
        return { checkoutUrl };
    }
    async handleCallback(payload) {
        const signature = payload.signature;
        if (!signature) {
            throw new appError_1.default('Missing signature', 400);
        }
        const { signature: _ignored, ...data } = payload;
        const computed = (0, sepay_1.signSepayPayload)(data);
        if (signature !== computed) {
            throw new appError_1.default('Invalid signature', 400);
        }
        const orderId = Number(data.order_id);
        await Order_1.default.findOneAndUpdate({ orderId }, { paymentStatus: 'paid', status: 'confirmed' }, { new: true });
    }
}
exports.default = new PaymentService();
//# sourceMappingURL=payment.service.js.map