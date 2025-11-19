"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const promotion_routes_1 = __importDefault(require("./promotion.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const report_routes_1 = __importDefault(require("./report.routes"));
const feedback_routes_1 = __importDefault(require("./feedback.routes"));
const consultation_routes_1 = __importDefault(require("./consultation.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/products', product_routes_1.default);
router.use('/orders', order_routes_1.default);
router.use('/promotions', promotion_routes_1.default);
router.use('/reviews', review_routes_1.default);
router.use('/reports', report_routes_1.default);
router.use('/feedback', feedback_routes_1.default);
router.use('/consultations', consultation_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map