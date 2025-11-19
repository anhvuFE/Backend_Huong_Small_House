"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sepayCallback = exports.createSepayCheckout = exports.updateOrderStatus = exports.getOrderDetail = exports.listMyOrders = exports.listOrders = exports.createOrder = void 0;
const order_service_1 = __importDefault(require("../services/order.service"));
const payment_service_1 = __importDefault(require("../services/payment.service"));
const appError_1 = __importDefault(require("../utils/appError"));
const createOrder = async (req, res) => {
    const payload = {
        userId: req.user?.id,
        guest: req.body.guest,
        email: req.body.email,
        items: req.body.items,
        paymentMethod: req.body.paymentMethod,
        note: req.body.note,
        promotionCode: req.body.promotionCode
    };
    const result = await order_service_1.default.createOrder(payload);
    res.status(201).json({ success: true, data: result });
};
exports.createOrder = createOrder;
const listOrders = async (_req, res) => {
    const orders = await order_service_1.default.listOrders();
    res.json({ success: true, data: orders });
};
exports.listOrders = listOrders;
const listMyOrders = async (req, res) => {
    const orders = await order_service_1.default.listOrdersByUser(req.user.id);
    res.json({ success: true, data: orders });
};
exports.listMyOrders = listMyOrders;
const extractUserId = (order) => {
    const value = order.user;
    if (!value)
        return undefined;
    if (value._id) {
        return value._id.toString();
    }
    if (typeof value.toString === 'function') {
        return value.toString();
    }
    return undefined;
};
const getOrderDetail = async (req, res) => {
    const { orderId } = req.params;
    const order = await order_service_1.default.getOrder(Number(orderId));
    if (!order) {
        throw new appError_1.default('Order not found', 404);
    }
    if (req.user?.role !== 'admin') {
        const ownerId = extractUserId(order);
        if (!ownerId || ownerId !== req.user?.id) {
            throw new appError_1.default('Forbidden', 403);
        }
    }
    res.json({ success: true, data: order });
};
exports.getOrderDetail = getOrderDetail;
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const order = await order_service_1.default.updateStatus(Number(orderId), req.body.status);
    res.json({ success: true, data: order });
};
exports.updateOrderStatus = updateOrderStatus;
const createSepayCheckout = async (req, res) => {
    const { orderId } = req.params;
    const checkout = await payment_service_1.default.createSepayCheckout(Number(orderId));
    res.json({ success: true, data: checkout });
};
exports.createSepayCheckout = createSepayCheckout;
const sepayCallback = async (req, res) => {
    await payment_service_1.default.handleCallback(req.body);
    res.json({ success: true });
};
exports.sepayCallback = sepayCallback;
//# sourceMappingURL=order.controller.js.map