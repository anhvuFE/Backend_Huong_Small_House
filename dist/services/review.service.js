"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Review_1 = __importDefault(require("../models/Review"));
const appError_1 = __importDefault(require("../utils/appError"));
class ReviewService {
    list(productId) {
        return Review_1.default.find({ productId }).populate('user', 'name').exec();
    }
    async create(payload) {
        const existing = await Review_1.default.findOne({ productId: payload.productId, user: payload.user }).exec();
        if (existing) {
            throw new appError_1.default('Bạn đã đánh giá sản phẩm này', 400);
        }
        return Review_1.default.create(payload);
    }
}
exports.default = new ReviewService();
//# sourceMappingURL=review.service.js.map