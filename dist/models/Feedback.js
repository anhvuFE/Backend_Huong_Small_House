"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const feedbackSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: { type: String, required: true },
    orderId: Number,
    productId: Number,
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    response: String
}, { timestamps: true });
const Feedback = (0, mongoose_1.model)('Feedback', feedbackSchema);
exports.default = Feedback;
//# sourceMappingURL=Feedback.js.map