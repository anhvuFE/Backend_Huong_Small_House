"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const autoIncrement_1 = require("../utils/autoIncrement");
const orderSchema = new mongoose_1.Schema({
    orderId: { type: Number, unique: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    guest: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Guest' },
    items: [
        {
            productId: { type: Number, required: true },
            name: String,
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'Sepay', 'Bank'], default: 'COD' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' },
    note: String,
    email: { type: String, required: true }
}, { timestamps: true });
orderSchema.pre('save', async function (next) {
    if (this.isNew && !this.orderId) {
        this.orderId = await (0, autoIncrement_1.getNextSequence)('orders');
    }
    next();
});
const Order = (0, mongoose_1.model)('Order', orderSchema);
exports.default = Order;
//# sourceMappingURL=Order.js.map