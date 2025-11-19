"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.listReviews = void 0;
const review_service_1 = __importDefault(require("../services/review.service"));
const listReviews = async (req, res) => {
    const { productId } = req.params;
    const reviews = await review_service_1.default.list(Number(productId));
    res.json({ success: true, data: reviews });
};
exports.listReviews = listReviews;
const createReview = async (req, res) => {
    const review = await review_service_1.default.create({
        productId: req.body.productId,
        rating: req.body.rating,
        comment: req.body.comment,
        user: req.user?.id
    });
    res.status(201).json({ success: true, data: review });
};
exports.createReview = createReview;
//# sourceMappingURL=review.controller.js.map