"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Feedback_1 = __importDefault(require("../models/Feedback"));
const appError_1 = __importDefault(require("../utils/appError"));
class FeedbackService {
    create(payload) {
        return Feedback_1.default.create({
            user: payload.userId,
            name: payload.name,
            email: payload.email,
            orderId: payload.orderId,
            productId: payload.productId,
            message: payload.message
        });
    }
    listAll() {
        return Feedback_1.default.find().populate('user', 'name email').sort({ createdAt: -1 }).exec();
    }
    listByUser(userId) {
        return Feedback_1.default.find({ user: userId }).sort({ createdAt: -1 }).exec();
    }
    async getById(id) {
        return Feedback_1.default.findById(id).populate('user', 'name email').exec();
    }
    async updateStatus(id, status) {
        const feedback = await Feedback_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!feedback) {
            throw new appError_1.default('Feedback not found', 404);
        }
        return feedback;
    }
    async respond(id, response) {
        const feedback = await Feedback_1.default.findByIdAndUpdate(id, { response, status: 'resolved' }, { new: true });
        if (!feedback) {
            throw new appError_1.default('Feedback not found', 404);
        }
        return feedback;
    }
}
exports.default = new FeedbackService();
//# sourceMappingURL=feedback.service.js.map