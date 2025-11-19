"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const promotionSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 }
}, { timestamps: true });
const Promotion = (0, mongoose_1.model)('Promotion', promotionSchema);
exports.default = Promotion;
//# sourceMappingURL=Promotion.js.map