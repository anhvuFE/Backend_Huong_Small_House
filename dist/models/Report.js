"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    bestSeller: { type: String, default: '' },
    userStats: {
        totalUsers: { type: Number },
        newUsers: { type: Number },
        lockedUsers: { type: Number },
        activeCustomers: { type: Number }
    },
    topCustomers: [
        {
            userId: { type: Number },
            name: { type: String },
            email: { type: String },
            totalOrders: { type: Number },
            totalSpent: { type: Number }
        }
    ]
}, { timestamps: true });
const Report = (0, mongoose_1.model)('Report', reportSchema);
exports.default = Report;
//# sourceMappingURL=Report.js.map