"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePromotion = exports.createPromotion = exports.listPromotions = void 0;
const promotion_service_1 = __importDefault(require("../services/promotion.service"));
const listPromotions = async (_req, res) => {
    const promotions = await promotion_service_1.default.list();
    res.json({ success: true, data: promotions });
};
exports.listPromotions = listPromotions;
const createPromotion = async (req, res) => {
    const promotion = await promotion_service_1.default.create(req.body);
    res.status(201).json({ success: true, data: promotion });
};
exports.createPromotion = createPromotion;
const validatePromotion = async (req, res) => {
    const { code } = req.params;
    const promotion = await promotion_service_1.default.validate(code);
    res.json({ success: true, data: promotion });
};
exports.validatePromotion = validatePromotion;
//# sourceMappingURL=promotion.controller.js.map