"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    bestSeller: { type: String, default: '' }
}, { timestamps: true });
const Report = (0, mongoose_1.model)('Report', reportSchema);
exports.default = Report;
//# sourceMappingURL=Report.js.map