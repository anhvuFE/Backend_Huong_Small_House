"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Promotion_1 = __importDefault(require("../models/Promotion"));
const appError_1 = __importDefault(require("../utils/appError"));
class PromotionService {
    list() {
        return Promotion_1.default.find().exec();
    }
    create(payload) {
        return Promotion_1.default.create(payload);
    }
    async validate(code) {
        const promo = await Promotion_1.default.findOne({ code }).exec();
        if (!promo) {
            throw new appError_1.default('Mã không tồn tại', 404);
        }
        return promo;
    }
}
exports.default = new PromotionService();
//# sourceMappingURL=promotion.service.js.map