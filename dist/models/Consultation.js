"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const consultationSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    topic: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    messages: [
        {
            sender: { type: String, enum: ['user', 'admin'], required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });
const Consultation = (0, mongoose_1.model)('Consultation', consultationSchema);
exports.default = Consultation;
//# sourceMappingURL=Consultation.js.map