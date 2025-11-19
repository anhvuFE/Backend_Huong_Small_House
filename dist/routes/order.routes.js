"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
router.post('/payment/sepay/callback', order_controller_1.sepayCallback);
router.post('/', auth_1.optionalAuth, order_controller_1.createOrder);
router.get('/me', auth_1.authenticate, order_controller_1.listMyOrders);
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), order_controller_1.listOrders);
router.get('/:orderId', auth_1.authenticate, order_controller_1.getOrderDetail);
router.patch('/:orderId/status', auth_1.authenticate, (0, auth_1.authorize)('admin'), order_controller_1.updateOrderStatus);
router.post('/:orderId/payment/sepay', auth_1.optionalAuth, order_controller_1.createSepayCheckout);
exports.default = router;
//# sourceMappingURL=order.routes.js.map