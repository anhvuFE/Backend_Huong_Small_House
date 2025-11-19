"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondFeedback = exports.updateFeedbackStatus = exports.getFeedbackDetail = exports.listFeedback = exports.listMyFeedback = exports.createFeedback = void 0;
const feedback_service_1 = __importDefault(require("../services/feedback.service"));
const appError_1 = __importDefault(require("../utils/appError"));
const createFeedback = async (req, res) => {
    const payload = {
        userId: req.user?.id,
        name: req.body.name,
        email: req.body.email,
        orderId: req.body.orderId,
        productId: req.body.productId,
        message: req.body.message
    };
    if (!payload.email || !payload.message) {
        throw new appError_1.default('Thiếu thông tin liên hệ hoặc nội dung', 400);
    }
    const feedback = await feedback_service_1.default.create(payload);
    res.status(201).json({ success: true, data: feedback });
};
exports.createFeedback = createFeedback;
const listMyFeedback = async (req, res) => {
    const feedback = await feedback_service_1.default.listByUser(req.user.id);
    res.json({ success: true, data: feedback });
};
exports.listMyFeedback = listMyFeedback;
const listFeedback = async (_req, res) => {
    const feedback = await feedback_service_1.default.listAll();
    res.json({ success: true, data: feedback });
};
exports.listFeedback = listFeedback;
const getFeedbackDetail = async (req, res) => {
    const { feedbackId } = req.params;
    const feedback = await feedback_service_1.default.getById(feedbackId);
    if (!feedback) {
        throw new appError_1.default('Feedback not found', 404);
    }
    if (req.user?.role !== 'admin' && feedback.user?.toString() !== req.user?.id) {
        throw new appError_1.default('Forbidden', 403);
    }
    res.json({ success: true, data: feedback });
};
exports.getFeedbackDetail = getFeedbackDetail;
const updateFeedbackStatus = async (req, res) => {
    const { feedbackId } = req.params;
    const feedback = await feedback_service_1.default.updateStatus(feedbackId, req.body.status);
    res.json({ success: true, data: feedback });
};
exports.updateFeedbackStatus = updateFeedbackStatus;
const respondFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const feedback = await feedback_service_1.default.respond(feedbackId, req.body.response);
    res.json({ success: true, data: feedback });
};
exports.respondFeedback = respondFeedback;
//# sourceMappingURL=feedback.controller.js.map